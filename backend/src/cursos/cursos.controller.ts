import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileInterceptor('imagenCurso', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Solo se permiten imágenes jpg, jpeg, png, gif'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async crearCurso(
    @UploadedFile() imagenCurso: Express.Multer.File,
    @Body() crearCursoDto: CrearCursoDto,
  ) {
    
    if (imagenCurso) {
      crearCursoDto.imagenCurso = imagenCurso.filename;
    }
    return this.cursosService.crearCurso(crearCursoDto);
  }

  
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imagenCurso', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Solo se permiten imágenes jpg, jpeg, png, gif'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async actualizarCurso(
    @Param('id') id: string,
    @UploadedFile() imagenCurso: Express.Multer.File,
    @Body() datos: Partial<CrearCursoDto>,
  ) {
    if (imagenCurso) {
      datos.imagenCurso = imagenCurso.filename;
    }
    return this.cursosService.actualizarCurso(+id, datos);
  }

  @Delete(':id')
  eliminarCurso(@Param('id') id: string) {
    return this.cursosService.eliminarCurso(+id);
  }
}
