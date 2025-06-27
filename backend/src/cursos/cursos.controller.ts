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
  BadRequestException,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './crear-curso.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  @Post(':id/imagen')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'imagenes-cursos'),
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo imágenes permitidas'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async subirImagenCurso(@Param('id') id: string, @UploadedFile() imagen: Express.Multer.File) {
    if (!imagen) {
      throw new BadRequestException('Imagen requerida');
    }

    
    const cursoActualizado = await this.cursosService.actualizarCurso(+id, { imagenCurso: imagen.filename });

    return {
      message: 'Imagen subida y curso actualizado correctamente',
      curso: cursoActualizado,
      rutaImagen: `/uploads/imagenes-cursos/${imagen.filename}`,
    };
  }
}