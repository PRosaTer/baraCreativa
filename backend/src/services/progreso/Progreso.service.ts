import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Usuario } from '../../entidades/usuario.entity';

@Injectable()
export class ProgresoService {
  constructor(
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
    @InjectRepository(ModuloEntity)
    private moduloRepository: Repository<ModuloEntity>,
    @InjectRepository(ReporteProgresoEntity)
    private reporteProgresoRepository: Repository<ReporteProgresoEntity>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async markModuloCompleted(cursoId: number, moduloId: number, usuarioId: number): Promise<void> {
    const curso = await this.cursoRepository.findOne({ where: { id: cursoId } });
    const modulo = await this.moduloRepository.findOne({ where: { id: moduloId } });
    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });

    if (!curso || !modulo || !usuario) {
      throw new NotFoundException('Curso, módulo o usuario no encontrado.');
    }

    let reporte = await this.reporteProgresoRepository.findOne({
      where: { usuario: { id: usuarioId }, modulo: { id: moduloId } },
      relations: ['usuario', 'modulo'],
    });

    if (!reporte) {
      reporte = new ReporteProgresoEntity();
      reporte.usuario = usuario;
      reporte.curso = curso;
      reporte.modulo = modulo;
    }

    reporte.completado = true;
    reporte.fechaCompletado = new Date();
    await this.reporteProgresoRepository.save(reporte);
  }

  async getNextModuleUrl(cursoId: number, usuarioId: number): Promise<{ url: string; tipo: TipoModulo } | null> {
    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
      relations: ['modulos'],
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado.');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Solución para el error de tipo: Usamos el operador de coalescencia nula (??)
    // para tratar los 'null' como 0 durante el ordenamiento.
    // Esto es temporal hasta que todos los módulos tengan un 'orden' asignado y
    // se haya revertido la entidad a 'orden: number'.
    const modulosOrdenados = curso.modulos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    const progresoUsuario = await this.reporteProgresoRepository.find({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId }, completado: true },
      relations: ['modulo'],
    });

    const modulosCompletadosIds = new Set(progresoUsuario.map(p => p.modulo.id));

    let nextModulo: ModuloEntity | undefined;
    for (const modulo of modulosOrdenados) {
      if (!modulosCompletadosIds.has(modulo.id)) {
        nextModulo = modulo;
        break;
      }
    }

    if (!nextModulo) {
      return { url: `/cursos/${cursoId}/final`, tipo: TipoModulo.TEXTO };
    }

    let nextUrl = '';
    switch (nextModulo.tipo) {
      case TipoModulo.SCORM:
        nextUrl = `/cursos/${cursoId}/scorm`;
        break;
      case TipoModulo.VIDEO:
        nextUrl = `/cursos/${cursoId}/video/${nextModulo.id}`;
        break;
      case TipoModulo.PDF:
        nextUrl = `/cursos/${cursoId}/pdf/${nextModulo.id}`;
        break;
      case TipoModulo.IMAGEN:
        nextUrl = `/cursos/${cursoId}/imagen/${nextModulo.id}`;
        break;
      case TipoModulo.TEXTO:
        nextUrl = `/cursos/${cursoId}/modulo/${nextModulo.id}`;
        break;
      default:
        nextUrl = `/cursos/${cursoId}/modulo/${nextModulo.id}`;
    }

    return { url: nextUrl, tipo: nextModulo.tipo };
  }

  async isScormModuloCompleted(cursoId: number, usuarioId: number): Promise<boolean> {
    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
      relations: ['modulos'],
    });
    if (!curso) return false;

    // Aseguramos que 'orden' no sea null para la comparación
    const scormModulo = curso.modulos.find(m => m.tipo === TipoModulo.SCORM && (m.orden ?? 0) === 1);

    if (!scormModulo) return false;

    const reporte = await this.reporteProgresoRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        curso: { id: cursoId },
        modulo: { id: scormModulo.id }
      },
    });

    return reporte ? reporte.completado : false;
  }
}