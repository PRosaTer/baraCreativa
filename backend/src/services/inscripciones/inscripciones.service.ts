import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../../entidades/inscripcion.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';

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

  async createInscripcion(usuario: Usuario, curso: Curso, estado = 'Pendiente'): Promise<Inscripcion> {
    const nuevaInscripcion = this.inscripcionRepository.create({ usuario, curso, estado });
    return this.inscripcionRepository.save(nuevaInscripcion);
  }

  async findByUserAndCourse(usuarioId: number, cursoId: number): Promise<Inscripcion | null> {
    return this.inscripcionRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        curso: { id: cursoId },
      },
      relations: ['usuario', 'curso'],
    });
  }

  async updateInscripcionEstado(inscripcionId: number, nuevoEstado: string): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({ where: { id: inscripcionId } });
    if (!inscripcion) {
      throw new Error(`Inscripción con ID ${inscripcionId} no encontrada.`);
    }
    inscripcion.estado = nuevoEstado;
    return this.inscripcionRepository.save(inscripcion);
  }

  async save(inscripcion: Inscripcion): Promise<Inscripcion> {
    return this.inscripcionRepository.save(inscripcion);
  }

  async obtenerCursosPorUsuario(usuarioId: number) {
    const inscripciones = await this.inscripcionRepository.find({
      where: {
        usuario: { id: usuarioId },
        estado: 'Pagado',
      },
      relations: ['curso'],
    });

    return inscripciones.map((insc) => ({
      id: insc.curso.id,
      titulo: insc.curso.titulo,
      imagenCurso: insc.curso.imagenCurso || null,
    }));
  }
}
