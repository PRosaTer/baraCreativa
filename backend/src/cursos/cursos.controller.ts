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
        destination: join(process.cwd(), 'uploads', 'imagenes-cursos'),
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
        destination: join(process.cwd(), 'uploads', 'scorm_unzipped_courses'),
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
    @Body('cursoId', ParseIntPipe) cursoId: number,
  ) {
    if (!scormFile) throw new BadRequestException('Archivo SCORM requerido');

    const scormZipPath = scormFile.path;
    const uniqueFolderName = uuidv4();
    const destinationPath = join(
      process.cwd(),
      'uploads',
      'scorm_unzipped_courses',
      uniqueFolderName,
    );

    try {
      const AdmZip = require('adm-zip');
      const fs = require('fs');

      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const zip = new AdmZip(scormZipPath);
      const imsManifestEntry = zip.getEntry('imsmanifest.xml');
      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException('El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).');
      }

      zip.extractAllTo(destinationPath, true);
      fs.unlinkSync(scormZipPath);

      const curso = await this.cursosService.obtenerCursoPorId(cursoId);
      if (!curso) throw new NotFoundException('Curso no encontrado');

      const proxyPath = `/uploads/scorm_unzipped_courses/${uniqueFolderName}/proxy.html`;
      curso.archivoScorm = proxyPath;
      await this.cursosService.actualizarCurso(cursoId, { archivoScorm: proxyPath });

      return {
        message: 'Archivo SCORM subido, descomprimido y curso actualizado automáticamente',
        path: proxyPath,
      };
    } catch (error) {
      console.error('Error al descomprimir el archivo SCORM:', error);

      const fs = require('fs');
      if (fs.existsSync(scormZipPath)) fs.unlinkSync(scormZipPath);
      if (fs.existsSync(destinationPath)) fs.rmSync(destinationPath, { recursive: true, force: true });

      throw new InternalServerErrorException('Error al descomprimir el archivo SCORM');
    }
  }
}
