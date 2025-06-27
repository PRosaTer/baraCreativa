import { Controller, Get, Post, Body, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './crear-curso.dto';
import { EditarCursoDto } from './editar-curso.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  async obtenerCursos() {
    return this.cursosService.obtenerTodos();
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagenCurso'))
  async crearCurso(
    @Body() body: CrearCursoDto,
    @UploadedFile() imagenCurso: Express.Multer.File,
  ) {
    return this.cursosService.crearCurso(body, imagenCurso);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagenCurso'))
  async editarCurso(
    @Param('id') id: number,
    @Body() body: EditarCursoDto,
    @UploadedFile() imagenCurso?: Express.Multer.File,
  ) {
    return this.cursosService.editarCurso(id, body, imagenCurso);
  }
}
