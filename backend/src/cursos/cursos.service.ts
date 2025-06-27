
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../entidades/curso.entity';
import { CrearCursoDto } from './crear-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
  ) {}

  async obtenerCursos(): Promise<Curso[]> {
    return this.cursosRepository.find({ relations: ['modulos'] });
  }

  async obtenerCursoPorId(id: number): Promise<Curso | null> {
    
    return this.cursosRepository.findOne({ where: { id }, relations: ['modulos'] });
  }

  async crearCurso(crearCursoDto: CrearCursoDto): Promise<Curso> {
    const nuevoCurso = this.cursosRepository.create(crearCursoDto);
    return this.cursosRepository.save(nuevoCurso);
  }

  async actualizarCurso(id: number, datosActualizar: Partial<CrearCursoDto>): Promise<Curso | null> {
    await this.cursosRepository.update(id, datosActualizar);
    
    return this.cursosRepository.findOne({ where: { id }, relations: ['modulos'] });
  }

  async eliminarCurso(id: number): Promise<void> {
    await this.cursosRepository.delete(id);
  }
}