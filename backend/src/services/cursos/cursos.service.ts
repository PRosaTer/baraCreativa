import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from '../../entidades/curso.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity'; 
import { Repository, DeepPartial } from 'typeorm';
import { CrearCursoDto } from '../../dto/cursos/crear-curso.dto';
import { join } from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursosRepository: Repository<Curso>,
    @InjectRepository(ModuloEntity)
    private readonly modulosRepository: Repository<ModuloEntity>,
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
    const nuevoCurso = this.cursosRepository.create(datos as DeepPartial<Curso>);
    return this.cursosRepository.save(nuevoCurso);
  }

  async actualizarCurso(
    id: number,
    datos: Partial<CrearCursoDto>,
  ): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);

    if (datos.modulos !== undefined) {
    }

    Object.assign(curso, datos);

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
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      const zip = new AdmZip(scormZipPath);
      const imsManifestEntry = zip.getEntry('imsmanifest.xml');

      if (!imsManifestEntry) {
        fs.unlinkSync(scormZipPath);
        throw new BadRequestException(
          'El archivo ZIP no es un paquete SCORM válido (falta imsmanifest.xml).',
        );
      }

      zip.extractAllTo(destinationPath, true);

      const imsManifestContent = imsManifestEntry.getData().toString('utf8');

      let scormEntryPoint = '';

      const resourceHrefMatch = imsManifestContent.match(
        /<resource[^>]*href="([^"]+)"[^>]*>/,
      );

      if (resourceHrefMatch && resourceHrefMatch[1]) {
        scormEntryPoint = resourceHrefMatch[1];
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
          'No se pudo determinar el punto de entrada del SCORM (ni en manifest, ni index.html, ni proxy.html).',
        );
      }

      const entryFilePath = join(destinationPath, scormEntryPoint);
      if (!fs.existsSync(entryFilePath)) {
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
            fs.rmSync(prevFullPath, { recursive: true, force: true });
          }
        }
      }

      const scormDbPath = `/uploads/scorm_unzipped_courses/${uniqueFolderName}/${scormEntryPoint}`;

      curso.archivoScorm = scormDbPath;
      await this.cursosRepository.save(curso);

      fs.unlinkSync(scormZipPath);

      return curso;
    } catch (error) {
      if (fs.existsSync(scormZipPath)) {
        fs.unlinkSync(scormZipPath);
      }

      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }


      if (error instanceof BadRequestException || error instanceof InternalServerErrorException || error instanceof NotFoundException) {
          throw error;
      } else if (error instanceof Error) {
          throw new InternalServerErrorException(`Error inesperado al procesar SCORM: ${error.message}`);
      } else {
          throw new InternalServerErrorException('Error inesperado y desconocido al procesar SCORM.');
      }
    }
  }

  async actualizarModuloFilePaths(
    moduloId: number,
    updatedPaths: { videoUrls?: string[]; pdfUrls?: string[]; imageUrls?: string[] }, 
  ): Promise<ModuloEntity> {
    console.log(`[CursosService] Intentando actualizar módulo ID: ${moduloId}`);
    console.log('[CursosService] Rutas recibidas para actualizar:', updatedPaths);

    const modulo = await this.modulosRepository.findOneBy({ id: moduloId });
    if (!modulo) {
      console.error(`[CursosService] Módulo con ID ${moduloId} no encontrado.`);
      throw new NotFoundException(`Módulo con ID ${moduloId} no encontrado`);
    }
    console.log('[CursosService] Módulo encontrado:', modulo.id, modulo.titulo, `Tipo inicial de la BD: ${modulo.tipo}`);


    modulo.videoUrl = modulo.videoUrl || [];
    modulo.pdfUrl = modulo.pdfUrl || [];
    modulo.imageUrl = modulo.imageUrl || [];

 
    if (updatedPaths.videoUrls && updatedPaths.videoUrls.length > 0) {
      console.log(`[CursosService] Añadiendo videoUrls: ${JSON.stringify(updatedPaths.videoUrls)} al array existente.`);
      updatedPaths.videoUrls.forEach(url => {
        if (!modulo.videoUrl!.includes(url)) { 
          modulo.videoUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.VIDEO; 
      console.log(`[CursosService] Tipo de módulo establecido a: ${modulo.tipo}`);
    }
    if (updatedPaths.pdfUrls && updatedPaths.pdfUrls.length > 0) {
      console.log(`[CursosService] Añadiendo pdfUrls: ${JSON.stringify(updatedPaths.pdfUrls)} al array existente.`);
      updatedPaths.pdfUrls.forEach(url => {
        if (!modulo.pdfUrl!.includes(url)) {
          modulo.pdfUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.PDF;
      console.log(`[CursosService] Tipo de módulo establecido a: ${modulo.tipo}`);
    }
    if (updatedPaths.imageUrls && updatedPaths.imageUrls.length > 0) {
      console.log(`[CursosService] Añadiendo imageUrls: ${JSON.stringify(updatedPaths.imageUrls)} al array existente.`);
      updatedPaths.imageUrls.forEach(url => {
        if (!modulo.imageUrl!.includes(url)) {
          modulo.imageUrl!.push(url);
        }
      });
      modulo.tipo = TipoModulo.IMAGEN;
      console.log(`[CursosService] Tipo de módulo establecido a: ${modulo.tipo}`);
    }

    console.log('[CursosService] Objeto ModuloEntity ANTES de guardar:', JSON.stringify(modulo, null, 2));

    const savedModulo = await this.modulosRepository.save(modulo);
    console.log('[CursosService] Módulo guardado en la base de datos:', savedModulo);
    return savedModulo;
  }
}
