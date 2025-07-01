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
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CrearCursoDto } from './crear-curso.dto';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

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

  @Post(':id/scorm')
  @UseInterceptors(
    FileInterceptor('scormFile', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'scorm'),
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo archivos .zip permitidos'), false);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async subirScorm(@Param('id') id: string, @UploadedFile() scormFile: Express.Multer.File) {
    if (!scormFile) {
      throw new BadRequestException('Archivo SCORM requerido');
    }
    const cursoActualizado = await this.cursosService.actualizarCurso(+id, { archivoScorm: scormFile.filename });
    return {
      message: 'SCORM subido y curso actualizado correctamente',
      curso: cursoActualizado,
      rutaScorm: `/uploads/scorm/${scormFile.filename}`,
    };
  }

  @Post('upload-scorm-zip')
  @UseInterceptors(
    FileInterceptor('scormFile', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'scorm'),
        filename: (req, file, cb) => {
          const uniqueName = uuidv4() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo archivos .zip permitidos'), false);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadAndProcessScorm(@UploadedFile() scormFile: Express.Multer.File) {
    if (!scormFile) {
      throw new BadRequestException('Archivo SCORM requerido');
    }

    const scormZipPath = scormFile.path;
    const uniqueFolderName = uuidv4();
    const destinationPath = join(process.cwd(), 'uploads', 'scorm_unzipped_courses', uniqueFolderName);
    let entryPoint = '';

    try {
      const zip = new AdmZip(scormZipPath);
      const zipEntries = zip.getEntries();

      const imsManifestEntry = zipEntries.find(entry => entry.entryName === 'imsmanifest.xml');

      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException('El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).');
      }

      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      zip.extractAllTo(destinationPath, /*overwrite*/ true);

      entryPoint = `/scorm_courses/${uniqueFolderName}/imsmanifest.xml`;

      const nuevoCurso = await this.cursosService.crearCurso({
        titulo: `Curso SCORM: ${scormFile.originalname.replace('.zip', '')}`,
        descripcion: 'Curso importado de un paquete SCORM.',
        precio: 0,
        duracionHoras: 0,
        tipo: 'Docentes',
        categoria: 'Importado SCORM',
        modalidad: 'grabado',
        certificadoDisponible: false,
        badgeDisponible: false,
        archivoScorm: entryPoint,
      });

      fs.unlinkSync(scormZipPath);

      return {
        message: 'Paquete SCORM subido, descomprimido y curso creado correctamente',
        curso: nuevoCurso,
        rutaScormDescomprimido: entryPoint,
      };
    } catch (error) {
      if (fs.existsSync(scormZipPath)) {
        fs.unlinkSync(scormZipPath);
      }
      console.error('Error al procesar el archivo SCORM:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar el paquete SCORM.');
    }
  }


  @Post('generate-scorm-from-modules')
  @UseInterceptors(AnyFilesInterceptor())
  async generateScormFromModules(
    @Body('courseData') courseDataString: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const courseData: CrearCursoDto = JSON.parse(courseDataString);

      const { scormPath, nuevoCurso } = await this.cursosService.generateScormPackage(courseData, files);

      return {
        message: 'Paquete SCORM generado y curso creado correctamente',
        curso: nuevoCurso,
        rutaScormGenerado: scormPath,
      };
    } catch (error) {
      console.error('Error al generar SCORM desde módulos:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al generar el paquete SCORM desde módulos.');
    }
  }
}
