import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from '../entidades/curso.entity';
import { Repository } from 'typeorm';
import { CrearCursoDto } from './crear-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
  ) {}

  obtenerCursos(): Promise<Curso[]> {
    console.log('[CursosService] Obteniendo todos los cursos...');
    return this.cursosRepository.find({ relations: ['modulos'] });
  }

  async obtenerCursoPorId(id: number): Promise<Curso> {
    console.log(`[CursosService] Obteniendo curso con ID: ${id}...`);
    const curso = await this.cursosRepository.findOne({
      where: { id },
      relations: ['modulos'],
    });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  crearCurso(datos: CrearCursoDto): Promise<Curso> {
    console.log('[CursosService] Creando nuevo curso:', datos.titulo);
    const curso = this.cursosRepository.create(datos);
    return this.cursosRepository.save(curso);
  }


  async actualizarCurso(id: number, datos: Partial<CrearCursoDto> & { imagenCurso?: string }): Promise<Curso> {
    console.log(`[CursosService] Actualizando curso con ID: ${id}...`);
    const curso = await this.obtenerCursoPorId(id);
    Object.assign(curso, datos); 
    return this.cursosRepository.save(curso);
  }

  async eliminarCurso(id: number): Promise<void> {
    console.log(`[CursosService] Eliminando curso con ID: ${id}...`);
    await this.cursosRepository.delete(id);
  }
}