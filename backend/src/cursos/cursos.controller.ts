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
  async actualizarCurso(@Param('id') id: string, @Body() datos: Partial<CrearCursoDto>) {
    return this.cursosService.actualizarCurso(+id, datos);
  }

  @Delete(':id')
  async eliminarCurso(@Param('id') id: string) {
    await this.cursosService.eliminarCurso(+id);
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
    const imagenCursoPath = `/uploads/imagenes-cursos/${imagen.filename}`;
    const cursoActualizado = await this.cursosService.actualizarCurso(+id, { imagenCurso: imagenCursoPath });
    return {
      message: 'Imagen subida y curso actualizado correctamente',
      curso: cursoActualizado,
      rutaImagen: imagenCursoPath,
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
    let scormEntryPoint = '';

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

 
      const configJsPath = join(destinationPath, 'config.js');
      if (!fs.existsSync(configJsPath)) {
        console.warn(`ADVERTENCIA: config.js no encontrado en el paquete SCORM. Creando un archivo por defecto.`);
        fs.writeFileSync(configJsPath, 'var scormnext = "habilon.scormnext.es";');
      }

      const jqueryPath = join(destinationPath, 'jquery-1.6.1.min.js');
      if (!fs.existsSync(jqueryPath)) {
        console.warn(`ADVERTENCIA: jquery-1.6.1.min.js no encontrado en el paquete SCORM. Esto puede causar problemas si el SCORM lo necesita.`);
  
      }
     

      const imsManifestContent = imsManifestEntry.getData().toString('utf8');
      const resourceHrefMatch = imsManifestContent.match(/<resource[^>]*href="([^"]+)"[^>]*>/);
      
      let foundEntryPointInManifest = false;
      if (resourceHrefMatch && resourceHrefMatch[1]) {
        let manifestHref = resourceHrefMatch[1];
        const queryParamIndex = manifestHref.indexOf('?');
        if (queryParamIndex !== -1) {
          manifestHref = manifestHref.substring(0, queryParamIndex);
        }
        if (fs.existsSync(join(destinationPath, manifestHref))) {
          scormEntryPoint = resourceHrefMatch[1];
          foundEntryPointInManifest = true;
        }
      }

      if (!foundEntryPointInManifest) {
        if (fs.existsSync(join(destinationPath, 'proxy.html'))) {
          scormEntryPoint = 'proxy.html';
        } else if (fs.existsSync(join(destinationPath, 'index.html'))) {
          scormEntryPoint = 'index.html';
        } else {
          throw new BadRequestException('No se pudo determinar el punto de entrada del SCORM (imsmanifest.xml, proxy.html o index.html no encontrados).');
        }
      }
      
      const scormDbPath = `/uploads/scorm_unzipped_courses/${uniqueFolderName}/${scormEntryPoint}`;

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
        imagenCurso: null,
        archivoScorm: scormDbPath,
      });

      fs.unlinkSync(scormZipPath);

      return {
        message: 'Paquete SCORM subido, descomprimido y curso creado correctamente',
        curso: nuevoCurso,
        rutaScormDescomprimido: scormDbPath,
      };
    } catch (error) {
      if (fs.existsSync(scormZipPath)) {
        fs.unlinkSync(scormZipPath);
      }
      console.error('Error al procesar el archivo SCORM:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (fs.existsSync(destinationPath) && fs.readdirSync(destinationPath).length === 0) {
        fs.rmdirSync(destinationPath);
      } else if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
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
