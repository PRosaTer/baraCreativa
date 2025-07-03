
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from '../entidades/curso.entity';
import { Repository, DeepPartial } from 'typeorm';
import { CrearCursoDto } from './crear-curso.dto';
import { join } from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
  ) {}

  obtenerCursos(): Promise<Curso[]> {
    return this.cursosRepository.find({ relations: ['modulos'] });
  }

  async obtenerCursoPorId(id: number): Promise<Curso> {
    const curso = await this.cursosRepository.findOne({
      where: { id },
      relations: ['modulos'],
    });
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return curso;
  }

  crearCurso(datos: CrearCursoDto): Promise<Curso> {
    const curso = this.cursosRepository.create(datos as DeepPartial<Curso>);
    return this.cursosRepository.save(curso);
  }

  async actualizarCurso(
    id: number,
    datos: Partial<CrearCursoDto>,
  ): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);
    for (const key in datos) {
      if (Object.prototype.hasOwnProperty.call(datos, key)) {
        curso[key] = datos[key];
      }
    }
    return this.cursosRepository.save(curso);
  }

  async eliminarCurso(id: number): Promise<void> {
    const result = await this.cursosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
  }

  async actualizarArchivoScorm(
    id: number,
    scormFile: Express.Multer.File,
  ): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);

    const scormZipPath = scormFile.path;
    const uniqueFolderName = uuidv4();
    const destinationPath = join(
      process.cwd(),
      'uploads',
      'scorm_unzipped_courses',
      uniqueFolderName,
    );

    try {
      console.log(`[SCORM DEBUG] Intentando crear carpeta de destino: ${destinationPath}`);
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
        console.log(`[SCORM DEBUG] Carpeta de destino creada: ${destinationPath}`);
      } else {
        console.log(`[SCORM DEBUG] Carpeta de destino ya existe: ${destinationPath}`);
      }

      console.log(`[SCORM DEBUG] Inicializando AdmZip con: ${scormZipPath}`);
      const zip = new AdmZip(scormZipPath);
      const imsManifestEntry = zip.getEntry('imsmanifest.xml');

      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException(
          'El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).',
        );
      }
      console.log(`[SCORM DEBUG] imsmanifest.xml encontrado.`);

      console.log(`[SCORM DEBUG] Extrayendo todos los archivos a: ${destinationPath}`);
      zip.extractAllTo(destinationPath, true);
      console.log(`[SCORM DEBUG] Extracción completada.`);

      const imsManifestContent = imsManifestEntry.getData().toString('utf8');
      console.log(`[SCORM DEBUG] Contenido de imsmanifest.xml (primeras 500 chars):\n${imsManifestContent.substring(0, 500)}...`);

      let scormEntryPoint = '';

      const resourceHrefMatch = imsManifestContent.match(
        /<resource[^>]*href="([^"]+)"[^>]*>/,
      );

      if (resourceHrefMatch && resourceHrefMatch[1]) {
        scormEntryPoint = resourceHrefMatch[1];
        console.log(`[SCORM DEBUG] Punto de entrada inicial desde manifest: ${scormEntryPoint}`);
        const queryParamIndex = scormEntryPoint.indexOf('?');
        if (queryParamIndex !== -1) {
          scormEntryPoint = scormEntryPoint.substring(0, queryParamIndex);
          console.log(`[SCORM DEBUG] Punto de entrada después de limpiar query params: ${scormEntryPoint}`);
        }
        if (scormEntryPoint.startsWith('/')) {
          scormEntryPoint = scormEntryPoint.slice(1);
          console.log(`[SCORM DEBUG] Punto de entrada después de quitar barra inicial: ${scormEntryPoint}`);
        }
      } else if (fs.existsSync(join(destinationPath, 'index.html'))) {
        scormEntryPoint = 'index.html';
        console.log(`[SCORM DEBUG] Punto de entrada por fallback: index.html`);
      } else if (fs.existsSync(join(destinationPath, 'proxy.html'))) {
        scormEntryPoint = 'proxy.html';
        console.log(`[SCORM DEBUG] Punto de entrada por fallback: proxy.html`);
      } else {
        throw new BadRequestException(
          'No se pudo determinar el punto de entrada del SCORM (ni en manifest, ni index.html, ni proxy.html).',
        );
      }

      
      const entryFilePath = join(destinationPath, scormEntryPoint);
      if (fs.existsSync(entryFilePath)) {
        const entryFileContent = fs.readFileSync(entryFilePath, 'utf8');
        console.log(`[SCORM DEBUG] Contenido del archivo de entrada (${scormEntryPoint}, primeras 500 chars):\n${entryFileContent.substring(0, 500)}...`);
        if (entryFileContent.trim().length === 0) {
          console.warn(`[SCORM DEBUG] ADVERTENCIA: El archivo de entrada (${scormEntryPoint}) está vacío o casi vacío después de la extracción.`);
       
        }
      } else {
        console.error(`[SCORM DEBUG] ERROR: El archivo de entrada (${scormEntryPoint}) NO EXISTE en la carpeta de destino después de la extracción.`);
        throw new InternalServerErrorException(`El archivo de entrada SCORM (${scormEntryPoint}) no se encontró después de la extracción.`);
      }
    


  
      if (curso.archivoScorm) {
        const prevParts = curso.archivoScorm.split('/');
        const prevFolder = prevParts.length > 3 ? prevParts[3] : null; 
        if (prevFolder) {
          const prevFullPath = join(
            process.cwd(),
            'uploads',
            'scorm_unzipped_courses',
            prevFolder,
          );
          if (fs.existsSync(prevFullPath)) {
            console.log(`[SCORM DEBUG] Eliminando carpeta SCORM anterior: ${prevFullPath}`);
            fs.rmSync(prevFullPath, { recursive: true, force: true });
          }
        }
      }

      const scormDbPath = `/uploads/scorm_unzipped_courses/${uniqueFolderName}/${scormEntryPoint}`;
      console.log(`[SCORM DEBUG] Ruta SCORM final para DB: ${scormDbPath}`);

      curso.archivoScorm = scormDbPath;
      await this.cursosRepository.save(curso);

    
      console.log(`[SCORM DEBUG] Eliminando archivo ZIP temporal: ${scormZipPath}`);
      fs.unlinkSync(scormZipPath);

      console.log(`[SCORM DEBUG] Proceso de SCORM completado exitosamente.`);
      return curso;
    } catch (error) {
      console.error(`[SCORM DEBUG] Error en el procesamiento de SCORM:`, error);
      if (fs.existsSync(scormZipPath)) {
        console.log(`[SCORM DEBUG] Limpiando archivo ZIP temporal tras error: ${scormZipPath}`);
        fs.unlinkSync(scormZipPath);
      }
     
      if (fs.existsSync(destinationPath)) {
        console.log(`[SCORM DEBUG] Limpiando carpeta de destino tras error: ${destinationPath}`);
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }
      
      throw error;
    }
  }
}
