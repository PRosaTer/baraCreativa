import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
import { Inscripcion } from '../../entidades/inscripcion.entity'; 
import { MarcarModuloCompletadoDto } from '../../interfaces/reporte-progreso.interface';
import { CertificadosService } from '../../services/certificados/certificados.service'; 

@Injectable()
export class ReporteProgresoService {
  private readonly logger = new Logger(ReporteProgresoService.name);

  constructor(
    @InjectRepository(ReporteProgresoEntity)
    private readonly reporteProgresoRepository: Repository<ReporteProgresoEntity>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(ModuloEntity)
    private readonly moduloRepository: Repository<ModuloEntity>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly certificadosService: CertificadosService,
  ) {}

  async marcarModuloCompletado(
    usuarioId: number,
    dto: MarcarModuloCompletadoDto,
  ): Promise<ReporteProgresoEntity> {
    const { cursoId, moduloId } = dto;

    this.logger.log(`Intentando marcar módulo ${moduloId} del curso ${cursoId} como completado para usuario ${usuarioId}`);

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      this.logger.warn(`Usuario ${usuarioId} no encontrado.`);
      throw new NotFoundException('Usuario no encontrado');
    }

    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    if (!curso) {
      this.logger.warn(`Curso ${cursoId} no encontrado.`);
      throw new NotFoundException('Curso no encontrado');
    }

    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId, curso: { id: cursoId } } });
    if (!modulo) {
      this.logger.warn(`Módulo ${moduloId} no encontrado en el curso ${cursoId}.`);
      throw new NotFoundException('Módulo no encontrado en este curso');
    }

    let reporteProgreso = await this.reporteProgresoRepository.findOne({
      where: { usuario: { id: usuarioId }, modulo: { id: moduloId }, curso: { id: cursoId } },
    });

    if (reporteProgreso && reporteProgreso.completado) {
      this.logger.log(`Módulo ${moduloId} del curso ${cursoId} ya estaba completado para usuario ${usuarioId}.`);
      return reporteProgreso;
    }

    if (!reporteProgreso) {
      reporteProgreso = this.reporteProgresoRepository.create({
        usuario,
        curso,
        modulo,
      });
      this.logger.log(`Creando nuevo reporte de progreso para módulo ${moduloId}.`);
    }

    reporteProgreso.completado = true;
    reporteProgreso.fechaCompletado = new Date();

    const reporteGuardado = await this.reporteProgresoRepository.save(reporteProgreso);
    this.logger.log(`Módulo ${moduloId} del curso ${cursoId} marcado como completado para usuario ${usuarioId}.`);


    await this.verificarYMarcarCursoCompleto(usuarioId, cursoId);

    return reporteGuardado;
  }

  async obtenerProgresoModulosUsuario(usuarioId: number, cursoId: number): Promise<ReporteProgresoEntity[]> {
    this.logger.log(`Obteniendo progreso de módulos para usuario ${usuarioId} en curso ${cursoId}.`);
    return this.reporteProgresoRepository.find({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      relations: ['modulo'],
    });
  }

  private async verificarYMarcarCursoCompleto(usuarioId: number, cursoId: number): Promise<void> {
    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
      relations: ['modulos'],
    });

    if (!curso) {
      this.logger.warn(`No se pudo verificar el curso ${cursoId} para marcar como completo.`);
      return;
    }

    const modulosCurso = curso.modulos;
    if (modulosCurso.length === 0) {
      this.logger.log(`Curso ${cursoId} no tiene módulos, no se puede marcar como completo.`);
      return;
    }

    const progresoUsuario = await this.reporteProgresoRepository.find({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId }, completado: true },
      relations: ['modulo'],
    });

    const modulosCompletadosIds = new Set(progresoUsuario.map(rp => rp.modulo.id));

    const todosLosModulosCompletados = modulosCurso.every(modulo =>
      modulosCompletadosIds.has(modulo.id)
    );

   
    if (todosLosModulosCompletados) {
      this.logger.log(`Todos los módulos del curso ${cursoId} completados por usuario ${usuarioId}. Marcando curso como completado.`);

      const inscripcion = await this.inscripcionRepository.findOne({
        where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      });

      if (inscripcion && !inscripcion.cursoCompletado) {
        inscripcion.cursoCompletado = true;
        inscripcion.estado = 'Completado';
        inscripcion.fechaFinalizacion = new Date();
        await this.inscripcionRepository.save(inscripcion);
        this.logger.log(`Inscripción ${inscripcion.id} marcada como completada para usuario ${usuarioId} y curso ${cursoId}.`);

        try {
          await this.certificadosService.generarCertificado(usuarioId, cursoId);
          this.logger.log(`Certificado generado automáticamente para usuario ${usuarioId} y curso ${cursoId}.`);
        } catch (error) {
          this.logger.error(`Error al generar certificado automáticamente para usuario ${usuarioId} y curso ${cursoId}:`, error.message);
          
        }
      } else if (inscripcion && inscripcion.cursoCompletado) {
        this.logger.log(`Curso ${cursoId} ya estaba marcado como completado para usuario ${usuarioId}.`);
      } else {
        this.logger.warn(`No se encontró inscripción para usuario ${usuarioId} y curso ${cursoId} al intentar marcar como completado.`);
      }
    }
  }
}
