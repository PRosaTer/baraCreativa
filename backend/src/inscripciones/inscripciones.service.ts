import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../entidades/inscripcion.entity';
import { Usuario } from '../entidades/usuario.entity';
import { Curso } from '../entidades/curso.entity';

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
  ) {}

  /**
   * Crea una nueva inscripción para un usuario en un curso.
   * @param usuario El objeto Usuario.
   * @param curso El objeto Curso.
   * @param estado El estado inicial de la inscripción (por defecto 'Pendiente').
   * @returns La nueva inscripción creada.
   */
  async createInscripcion(usuario: Usuario, curso: Curso, estado: string = 'Pendiente'): Promise<Inscripcion> {
    const nuevaInscripcion = this.inscripcionRepository.create({ usuario, curso, estado });
    return this.inscripcionRepository.save(nuevaInscripcion);
  }

  /**
   * Busca una inscripción específica por usuario y curso.
   * @param usuarioId El ID del usuario.
   * @param cursoId El ID del curso.
   * @returns La inscripción encontrada o null si no existe.
   */
  async findByUserAndCourse(usuarioId: number, cursoId: number): Promise<Inscripcion | null> {
    return this.inscripcionRepository.findOne({
      where: { 
        usuario: { id: usuarioId },
        curso: { id: cursoId }
      },
      relations: ['usuario', 'curso'],
    });
  }

  /**
   * Actualiza el estado de una inscripción existente.
   * @param inscripcionId El ID de la inscripción a actualizar.
   * @param nuevoEstado El nuevo estado de la inscripción.
   * @returns La inscripción actualizada.
   */
  async updateInscripcionEstado(inscripcionId: number, nuevoEstado: string): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id: inscripcionId } });
    if (!inscripcion) {
      throw new Error(`Inscripción con ID ${inscripcionId} no encontrada.`);
    }
    inscripcion.estado = nuevoEstado;
    return this.inscripcionRepository.save(inscripcion);
  }

  /**
   * Verifica si un usuario está inscrito y su inscripción está 'Completado' para un curso.
   * @param usuarioId El ID del usuario.
   * @param cursoId El ID del curso.
   * @returns true si el usuario está inscrito y el estado es 'Completado', false en caso contrario.
   */
  async isUserEnrolledAndCompleted(usuarioId: number, cursoId: number): Promise<boolean> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        curso: { id: cursoId },
        estado: 'Completado', 
      },
    });
    return !!inscripcion; 
  }
}
