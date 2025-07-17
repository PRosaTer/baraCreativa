import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Inscripcion } from '../../entidades/inscripcion.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { CertificadosService } from '../certificados/certificados.service';

@Injectable()
export class InscripcionesService {
  private readonly logger = new Logger(InscripcionesService.name);

  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    private readonly certificadosService: CertificadosService, 
  ) {}

  async createInscripcion(usuario: Usuario, curso: Curso, estado = 'Pendiente'): Promise<Inscripcion> {
    this.logger.log(`Creando inscripción para usuario ${usuario.id} y curso ${curso.id}`);
    const nuevaInscripcion = this.inscripcionRepository.create({ usuario, curso, estado });
    return this.inscripcionRepository.save(nuevaInscripcion);
  }

  async findByUserAndCourse(usuarioId: number, cursoId: number): Promise<Inscripcion | null> {
    this.logger.log(`Buscando inscripción para usuario ${usuarioId} y curso ${cursoId}`);
    return this.inscripcionRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        curso: { id: cursoId },
      },
      relations: ['usuario', 'curso'],
    });
  }

  async updateInscripcionEstado(inscripcionId: number, nuevoEstado: string): Promise<Inscripcion> {
    this.logger.log(`Actualizando estado de inscripción ${inscripcionId} a ${nuevoEstado}`);
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id: inscripcionId } });
    if (!inscripcion) {
      this.logger.error(`Inscripción con ID ${inscripcionId} no encontrada para actualizar estado.`);
      throw new NotFoundException(`Inscripción con ID ${inscripcionId} no encontrada.`);
    }
    inscripcion.estado = nuevoEstado;
    return this.inscripcionRepository.save(inscripcion);
  }

  async markInscripcionAsPaid(usuarioId: number, cursoId: number): Promise<Inscripcion> {
    this.logger.log(`Marcando inscripción como 'Pagado' para usuario ${usuarioId} y curso ${cursoId}.`);
    let inscripcion = await this.findByUserAndCourse(usuarioId, cursoId);

    if (!inscripcion) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
      const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });

      if (!usuario || !curso) {
        this.logger.error(`Usuario o Curso no encontrado para crear inscripción pagada. Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);
        throw new NotFoundException('Usuario o Curso no encontrado para crear inscripción pagada.');
      }
      inscripcion = this.inscripcionRepository.create({ usuario, curso, estado: 'Pagado' });
    } else {
      inscripcion.estado = 'Pagado';
    }
    const savedInscripcion = await this.inscripcionRepository.save(inscripcion);
    this.logger.log(`Inscripción para usuario ${usuarioId} y curso ${cursoId} marcada como 'Pagado'.`);
    return savedInscripcion;
  }

  async save(inscripcion: Inscripcion): Promise<Inscripcion> {
    this.logger.log(`Guardando inscripción ID: ${inscripcion.id}`);
    return this.inscripcionRepository.save(inscripcion);
  }

  async obtenerCursosPorUsuario(usuarioId: number) {
    this.logger.log(`Obteniendo cursos por usuario ID: ${usuarioId}`);
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        usuario: { id: usuarioId },
        estado: In(['Pagado', 'Completado']),
      },
      relations: ['curso'],
    });

    return inscripciones.map((insc) => ({
      id: insc.curso.id,
      titulo: insc.curso.titulo,
      imagenCurso: insc.curso.imagenCurso || null,
      estado: insc.estado,
    }));
  }

  /**
   * NUEVO MÉTODO: Marca un curso como completado para un usuario y dispara la generación del certificado.
   * Este método debería ser llamado cuando tu lógica de negocio determine que un usuario ha finalizado un curso.
   * Por ejemplo, después de completar todos los módulos, aprobar un examen, etc.
   * @param usuarioId El ID del usuario que completó el curso.
   * @param cursoId El ID del curso completado.
   * @returns La inscripción actualizada.
   */
  async markCourseAsCompleted(usuarioId: number, cursoId: number): Promise<Inscripcion> {
    this.logger.log(`[markCourseAsCompleted] Intentando marcar curso ${cursoId} como completado para usuario ${usuarioId}`);

    const inscripcion = await this.inscripcionRepository.findOne({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      relations: ['usuario', 'curso'],
    });

    if (!inscripcion) {
      this.logger.error(`[markCourseAsCompleted] Inscripción no encontrada para usuario ${usuarioId} y curso ${cursoId}.`);
      throw new NotFoundException(`Inscripción no encontrada para usuario ${usuarioId} y curso ${cursoId}.`);
    }

    if (inscripcion.cursoCompletado) {
      this.logger.warn(`[markCourseAsCompleted] Curso ${cursoId} ya estaba marcado como completado para usuario ${usuarioId}. No se generará un nuevo certificado.`);
      return inscripcion;
    }

    
    inscripcion.cursoCompletado = true;
    inscripcion.fechaFinalizacion = new Date();
    inscripcion.estado = 'Completado';

    let updatedInscripcion: Inscripcion;
    try {
        updatedInscripcion = await this.inscripcionRepository.save(inscripcion);
        this.logger.log(`[markCourseAsCompleted] Inscripción ${inscripcion.id} marcada como 'Completado' para usuario ${usuarioId} y curso ${cursoId}.`);
    } catch (dbError) {
        this.logger.error(`[markCourseAsCompleted] ERROR al guardar la inscripción como completada en la DB para usuario ${usuarioId}, curso ${cursoId}: ${(dbError as Error).message}`);
        throw new InternalServerErrorException(`Error al actualizar el estado de la inscripción.`);
    }


    try {
      const certificadoPath = await this.certificadosService.generarCertificado(usuarioId, cursoId);
      this.logger.log(`[markCourseAsCompleted] Certificado generado/obtenido con éxito para usuario ${usuarioId} y curso ${cursoId}. Ruta: ${certificadoPath}`);
    } catch (certError) {
      this.logger.error(`[markCourseAsCompleted] ERROR al intentar generar el certificado para usuario ${usuarioId} y curso ${cursoId}: ${(certError as Error).message}`);
    }

    return updatedInscripcion;
  }
}
