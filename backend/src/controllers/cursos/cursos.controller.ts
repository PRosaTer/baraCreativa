// src/controllers/cursos/cursos.controller.ts
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CursosService } from '../../services/cursos/cursos.service';
import { CrearCursoDto } from '../../dto/cursos/crear-curso.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SubirScormDto } from '../../types/subir-scorm.dto';
import * as fs from 'fs';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProgresoService } from '../../services/progreso/Progreso.service';

interface UserRequest extends Request {
  user: { id: number };
}

@Controller('api/cursos')
export class CursosController {
  constructor(
    private readonly cursosService: CursosService,
    private readonly progresoService: ProgresoService,
  ) {}

  @Get()
  obtenerCursos() {
    return this.cursosService.obtenerCursos();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obtenerCursoPorId(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('ID de usuario no encontrado en la solicitud.');
    }

    const curso = await this.cursosService.obtenerCursoPorId(id);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    const scormCompletadoUsuario = await this.progresoService.isScormModuloCompleted(id, userId);

    return { ...curso, scormCompletadoUsuario };
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
    const { cursoId } = body;

    if (!scormFile) throw new BadRequestException('Archivo SCORM requerido');

    try {
      const updatedCurso = await this.cursosService.actualizarArchivoScorm(cursoId, scormFile);

      return {
        message: 'Archivo SCORM subido, descomprimido y curso actualizado correctamente',
        path: updatedCurso.archivoScorm,
      };
    } catch (error) {
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
    FilesInterceptor('files', 100, { 
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
    console.log(`[CursosController] Recibida petición para subir archivos de módulo para ID: ${moduloId}`);
    console.log(`[CursosController] Archivos recibidos (cantidad): ${files ? files.length : 0}`);

    if (!files || files.length === 0) {
      console.log('[CursosController] No se subieron archivos para el módulo.');
      throw new BadRequestException('No se subieron archivos para el módulo.');
    }

    // ¡Cambiado para que sean arrays!
    const updatedPaths: {
      videoUrls: string[]; 
      pdfUrls: string[]; 
      imageUrls: string[]; 
    } = {
      videoUrls: [],
      pdfUrls: [],
      imageUrls: [],
    };

    files.forEach(file => {
      const filePath = `/uploads/modulos/${file.filename}`;
      console.log(`[CursosController] Procesando archivo: ${file.originalname}, MimeType: ${file.mimetype}, Path: ${filePath}`);

      if (file.mimetype.startsWith('video/')) {
        updatedPaths.videoUrls.push(filePath); // Añadir al array
        console.log(`[CursosController] Añadido videoUrl: ${filePath}`);
      } else if (file.mimetype === 'application/pdf') {
        updatedPaths.pdfUrls.push(filePath); // Añadir al array
        console.log(`[CursosController] Añadido pdfUrl: ${filePath}`);
      } else if (file.mimetype.startsWith('image/')) {
        updatedPaths.imageUrls.push(filePath); // Añadir al array
        console.log(`[CursosController] Añadido imageUrl: ${filePath}`);
      } else {
        console.warn(`[CursosController] Tipo de archivo no reconocido o no esperado: ${file.mimetype}`);
      }
    });

    console.log('[CursosController] updatedPaths final antes de llamar al servicio:', updatedPaths);

    try {
      // Pasar los arrays de URLs al servicio
      const updatedModulo = await this.cursosService.actualizarModuloFilePaths(moduloId, updatedPaths);
      console.log('[CursosController] Módulo actualizado en la BD:', updatedModulo);
      return {
        message: 'Archivos de módulo subidos y rutas actualizadas correctamente',
        modulo: updatedModulo,
      };
    } catch (error) {
      console.error('[CursosController] Error al procesar la subida de archivos del módulo:', error);
      throw new InternalServerErrorException('Error al procesar la subida de archivos del módulo');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cursoId/next-module')
  async getNextModule(@Param('cursoId', ParseIntPipe) cursoId: number, @Req() req: UserRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('ID de usuario no encontrado en la solicitud.');
    }

    try {
      const nextModuleData = await this.progresoService.getNextModuleUrl(cursoId, userId);
      if (!nextModuleData) {
        throw new NotFoundException('No se encontró el siguiente módulo o el curso ha finalizado.');
      }
      return nextModuleData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el siguiente módulo.');
    }
  }
}
