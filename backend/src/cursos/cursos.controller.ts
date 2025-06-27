import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './crear-curso.dto';

@Controller('api/cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  obtenerCursos() {
    return this.cursosService.obtenerCursos();
  }

  @Get(':id')
  async obtenerCursoPorId(@Param('id') id: string) {
    const curso = await this.cursosService.obtenerCursoPorId(+id);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  @Post()
  crearCurso(@Body() crearCursoDto: CrearCursoDto) {
    return this.cursosService.crearCurso(crearCursoDto);
  }

  @Patch(':id')
  actualizarCurso(@Param('id') id: string, @Body() datos: Partial<CrearCursoDto>) {
    return this.cursosService.actualizarCurso(+id, datos);
  }

  @Delete(':id')
  eliminarCurso(@Param('id') id: string) {
    return this.cursosService.eliminarCurso(+id);
  }
}