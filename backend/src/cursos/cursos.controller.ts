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
  InternalServerErrorException,
  ParseIntPipe,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './crear-curso.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SubirScormDto } from '../types/subir-scorm.dto';
import * as fs from 'fs';

@Controller('api/cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Get()
  obtenerCursos() {
    return this.cursosService.obtenerCursos();
  }

  @Get(':id')
  async obtenerCursoPorId(@Param('id', ParseIntPipe) id: number) {
    const curso = await this.cursosService.obtenerCursoPorId(id);
    if (!curso) throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    return curso;
  }

  @Post()
  crearCurso(@Body() crearCursoDto: CrearCursoDto) {
    return this.cursosService.crearCurso(crearCursoDto);
  }

  @Patch(':id')
  actualizarCurso(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<CrearCursoDto>,
  ) {
    return this.cursosService.actualizarCurso(id, datos);
  }

  @Delete(':id')
  async eliminarCurso(@Param('id', ParseIntPipe) id: number) {
    await this.cursosService.eliminarCurso(id);
    return { message: `Curso con ID ${id} eliminado correctamente` };
  }

  @Post(':id/imagen')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'imagenes-cursos');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new BadRequestException('Solo imágenes permitidas'), false);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async subirImagenCurso(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    if (!imagen) throw new BadRequestException('Imagen requerida');

    const imagenCursoPath = `/uploads/imagenes-cursos/${imagen.filename}`;
    const cursoActualizado = await this.cursosService.actualizarCurso(id, {
      imagenCurso: imagenCursoPath,
    });

    return {
      message: 'Imagen subida y curso actualizado correctamente',
      curso: cursoActualizado,
      rutaImagen: imagenCursoPath,
    };
  }

  @Post('scorm_unzipped_courses')
  @UseInterceptors(
    FileInterceptor('scormFile', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'scorm_unzipped_courses');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'application/zip' ||
          file.mimetype === 'application/x-zip-compressed'
        )
          cb(null, true);
        else cb(new BadRequestException('Solo archivos .zip permitidos'), false);
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async subirScormNuevo(
    @UploadedFile() scormFile: Express.Multer.File,
    @Body() body: SubirScormDto,
  ) {
    console.log('--- Depuración SCORM Upload ---');
    console.log('scormFile (recibido por Multer):', scormFile);
    console.log('Body (recibido por el controlador ANTES de la validación del DTO):', body);
    console.log('Tipo de body.cursoId:', typeof body.cursoId);
    console.log('Valor de body.cursoId:', body.cursoId);

    const { cursoId } = body;

    if (!scormFile) throw new BadRequestException('Archivo SCORM requerido');

    try {
      const updatedCurso = await this.cursosService.actualizarArchivoScorm(cursoId, scormFile);

      return {
        message: 'Archivo SCORM subido, descomprimido y curso actualizado correctamente',
        path: updatedCurso.archivoScorm,
      };
    } catch (error) {
      console.error('Error al procesar el archivo SCORM en el controlador:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar el archivo SCORM');
    }
  }

  @Post('modulos/:id/files')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const moduloUploadPath = join(process.cwd(), 'uploads', 'modulos');
          if (!fs.existsSync(moduloUploadPath)) {
            fs.mkdirSync(moduloUploadPath, { recursive: true });
          }
          cb(null, moduloUploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten archivos de video, PDF o imagen'), false);
        }
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async uploadModuloFiles(
    @Param('id', ParseIntPipe) moduloId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se subieron archivos para el módulo.');
    }

    const updatedPaths: {
      videoUrl: string | null;
      pdfUrl: string | null;  
      imageUrl: string | null; 
    } = {
      videoUrl: null,
      pdfUrl: null,
      imageUrl: null,
    };

    files.forEach(file => {
      const filePath = `/uploads/modulos/${file.filename}`;
      if (file.mimetype.startsWith('video/')) {
        updatedPaths.videoUrl = filePath;
      } else if (file.mimetype === 'application/pdf') {
        updatedPaths.pdfUrl = filePath;
      } else if (file.mimetype.startsWith('image/')) {
        updatedPaths.imageUrl = filePath;
      }
    });

    try {
      const updatedModulo = await this.cursosService.actualizarModuloFilePaths(moduloId, updatedPaths);
      return {
        message: 'Archivos de módulo subidos y rutas actualizadas correctamente',
        modulo: updatedModulo,
      };
    } catch (error) {
      console.error('Error al subir archivos de módulo:', error);
      throw new InternalServerErrorException('Error al procesar la subida de archivos del módulo');
    }
  }
}