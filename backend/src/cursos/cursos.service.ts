import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from '../entidades/curso.entity';
import { CrearCursoDto } from './crear-curso.dto';
import { EditarCursoDto } from './editar-curso.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async obtenerTodos(): Promise<Curso[]> {
    return this.cursoRepository.find();
  }

  async crearCurso(dto: CrearCursoDto, archivoImagen?: Express.Multer.File): Promise<Curso> {
    const nuevoCurso = this.cursoRepository.create(dto);

    if (archivoImagen) {
      const nombreArchivo = Date.now() + '-' + archivoImagen.originalname;
      const rutaArchivo = path.join(process.cwd(), 'uploads', nombreArchivo);
      fs.writeFileSync(rutaArchivo, archivoImagen.buffer);
      nuevoCurso.imagenCurso = nombreArchivo;
    }

    return this.cursoRepository.save(nuevoCurso);
  }

  async editarCurso(id: number, dto: EditarCursoDto, archivoImagen?: Express.Multer.File): Promise<Curso> {
    const curso = await this.cursoRepository.findOneBy({ id });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${id} no encontrado`);
    }

    Object.assign(curso, dto);

    if (archivoImagen) {
      const nombreArchivo = Date.now() + '-' + archivoImagen.originalname;
      const rutaArchivo = path.join(process.cwd(), 'uploads', nombreArchivo);
      fs.writeFileSync(rutaArchivo, archivoImagen.buffer);
      curso.imagenCurso = nombreArchivo;
    }

    return this.cursoRepository.save(curso);
  }
}
