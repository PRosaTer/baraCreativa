import {
  Injectable,
  NotFoundException,
  BadRequestException,
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
        // @ts-ignore
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
      // Crear carpeta destino si no existe
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      // Abrir zip y verificar imsmanifest.xml
      const zip = new AdmZip(scormZipPath);
      const imsManifestEntry = zip.getEntry('imsmanifest.xml');

      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException(
          'El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).',
        );
      }

      zip.extractAllTo(destinationPath, true);

      // Leer imsmanifest.xml para determinar archivo de entrada SCORM
      const imsManifestContent = imsManifestEntry.getData().toString('utf8');
      let scormEntryPoint = '';

      const resourceHrefMatch = imsManifestContent.match(
        /<resource[^>]*href="([^"]+)"[^>]*>/,
      );

      if (resourceHrefMatch && resourceHrefMatch[1]) {
        scormEntryPoint = resourceHrefMatch[1];
        // Limpiar query params y slash inicial
        const queryParamIndex = scormEntryPoint.indexOf('?');
        if (queryParamIndex !== -1) {
          scormEntryPoint = scormEntryPoint.substring(0, queryParamIndex);
        }
        if (scormEntryPoint.startsWith('/')) {
          scormEntryPoint = scormEntryPoint.slice(1);
        }
      } else if (fs.existsSync(join(destinationPath, 'index.html'))) {
        scormEntryPoint = 'index.html';
      } else if (fs.existsSync(join(destinationPath, 'proxy.html'))) {
        scormEntryPoint = 'proxy.html';
      } else {
        throw new BadRequestException(
          'No se pudo determinar el punto de entrada del SCORM.',
        );
      }

      // Si ya había un SCORM anterior, eliminar la carpeta vieja
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
            fs.rmSync(prevFullPath, { recursive: true, force: true });
          }
        }
      }

      // Guardar la ruta completa del SCORM con el archivo de entrada detectado
      const scormDbPath = `/uploads/scorm_unzipped_courses/${uniqueFolderName}/${scormEntryPoint}`;

      curso.archivoScorm = scormDbPath;
      await this.cursosRepository.save(curso);

      // Borrar el zip original después de extraer
      fs.unlinkSync(scormZipPath);

      return curso;
    } catch (error) {
      if (fs.existsSync(scormZipPath)) {
        fs.unlinkSync(scormZipPath);
      }
      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }
      throw error;
    }
  }
}
