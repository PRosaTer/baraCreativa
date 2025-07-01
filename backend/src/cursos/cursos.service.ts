import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from '../entidades/curso.entity';
import { Repository, DeepPartial } from 'typeorm'; 
import { CrearCursoDto, ModuloDto } from './crear-curso.dto';
import { join, extname } from 'path';
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

  async actualizarCurso(id: number, datos: Partial<CrearCursoDto> & { imagenCurso?: string | null; archivoScorm?: string | null }): Promise<Curso> {
    const curso = await this.obtenerCursoPorId(id);
    Object.assign(curso, datos as DeepPartial<Curso>);
    return this.cursosRepository.save(curso);
  }

  async eliminarCurso(id: number): Promise<void> {
    await this.cursosRepository.delete(id);
  }


  private parseFileFieldname(fieldname: string): { moduleIndex: number; fileType: 'videos' | 'pdfs' | 'imagenes' } | null {
    const match = fieldname.match(/modulos\[(\d+)\]\[(videos|pdfs|imagenes)\]/);
    if (match && match[1] && match[2]) {
      return {
        moduleIndex: parseInt(match[1], 10),
        fileType: match[2] as 'videos' | 'pdfs' | 'imagenes',
      };
    }
    return null;
  }

  /**
   
   * @param courseData
   * @param uploadedFiles
   * @returns
   */
  async generateScormPackage(courseData: CrearCursoDto, uploadedFiles: Array<Express.Multer.File>): Promise<{ scormPath: string; nuevoCurso: Curso }> {
    const uniqueCourseId = uuidv4();
    const scormTempDir = join(process.cwd(), 'uploads', 'scorm_temp', uniqueCourseId);
    const scormOutputZipPath = join(process.cwd(), 'uploads', 'scorm', `${uniqueCourseId}.zip`);
    const scormUnzippedPath = join(process.cwd(), 'uploads', 'scorm_unzipped_courses', uniqueCourseId);


    const moduleFilesMap = new Map<number, { videos: Express.Multer.File[]; pdfs: Express.Multer.File[]; imagenes: Express.Multer.File[]; }>();

    uploadedFiles.forEach(file => {
      const parsed = this.parseFileFieldname(file.fieldname);
      if (parsed) {
        const { moduleIndex, fileType } = parsed;
        if (!moduleFilesMap.has(moduleIndex)) {
          moduleFilesMap.set(moduleIndex, { videos: [], pdfs: [], imagenes: [] });
        }
        moduleFilesMap.get(moduleIndex)?.[fileType].push(file);
      }
    });

    try {

      fs.mkdirSync(scormTempDir, { recursive: true });
      fs.mkdirSync(scormUnzippedPath, { recursive: true });

      const manifestItems: string[] = [];
      const manifestResources: string[] = [];
      const moduleEntitiesToSave: ModuloDto[] = [];


      if (courseData.modulos) {
        for (const [index, module] of courseData.modulos.entries()) {
          const moduleFolderName = `module_${index + 1}`;
          const modulePath = join(scormTempDir, moduleFolderName);
          fs.mkdirSync(modulePath, { recursive: true });

          const moduleFilesForResource: string[] = [];
          const currentModuleFiles = moduleFilesMap.get(index) || { videos: [], pdfs: [], imagenes: [] };

          const videoUrlsInModule: string[] = [];
          const pdfUrlsInModule: string[] = [];
          const imageUrlsInModule: string[] = [];


          for (const videoFile of currentModuleFiles.videos) {
            const uniqueVideoName = `${uuidv4()}${extname(videoFile.originalname)}`;
            const destPath = join(modulePath, uniqueVideoName);
            fs.copyFileSync(videoFile.path, destPath);
            videoUrlsInModule.push(uniqueVideoName);
            moduleFilesForResource.push(`${moduleFolderName}/${uniqueVideoName}`);
            fs.unlinkSync(videoFile.path);
          }


          for (const pdfFile of currentModuleFiles.pdfs) {
            const uniquePdfName = `${uuidv4()}${extname(pdfFile.originalname)}`;
            const destPath = join(modulePath, uniquePdfName);
            fs.copyFileSync(pdfFile.path, destPath);
            pdfUrlsInModule.push(uniquePdfName);
            moduleFilesForResource.push(`${moduleFolderName}/${uniquePdfName}`);
            fs.unlinkSync(pdfFile.path);
          }


          for (const imageFile of currentModuleFiles.imagenes) {
            const uniqueImageName = `${uuidv4()}${extname(imageFile.originalname)}`;
            const destPath = join(modulePath, uniqueImageName);
            fs.copyFileSync(imageFile.path, destPath);
            imageUrlsInModule.push(uniqueImageName);
            moduleFilesForResource.push(`${moduleFolderName}/${uniqueImageName}`);
            fs.unlinkSync(imageFile.path);
          }

  
          const moduleHtmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${module.titulo}</title>
                <style>
                  body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto; background-color: #f9fafb; color: #333; }
                  h1 { color: #1e40af; border-bottom: 2px solid #bfdbfe; padding-bottom: 10px; margin-bottom: 20px; }
                  h2 { color: #1e40af; margin-top: 30px; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; }
                  p { margin-bottom: 15px; }
                  video, img { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                  a { color: #2563eb; text-decoration: none; }
                  a:hover { text-decoration: underline; }
                  ul { list-style-type: disc; margin-left: 20px; margin-bottom: 15px; }
                  li { margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <h1>${module.titulo}</h1>
                <p>${module.descripcion}</p>

                ${videoUrlsInModule.length > 0 ? `<h2>Videos</h2>` : ''}
                ${videoUrlsInModule.map(videoName => `<video controls src="${videoName}" style="width:100%;"></video>`).join('')}

                ${pdfUrlsInModule.length > 0 ? `<h2>Documentos (PDF)</h2>` : ''}
                ${pdfUrlsInModule.map(pdfName => `<p><a href="${pdfName}" target="_blank">${pdfName}</a></p>`).join('')}

                ${imageUrlsInModule.length > 0 ? `<h2>Imágenes</h2>` : ''}
                ${imageUrlsInModule.map(imageName => `<img src="${imageName}" alt="${imageName}">`).join('')}

                <!-- Scripts de SCORM API (opcional, si necesitas seguimiento de progreso detallado) -->
                <!-- Puedes incluir aquí los scripts de scormnext.es si tu curso se ejecutará dentro de su wrapper -->
                <!-- <script src="https://backend.scormnext.es/connector/3.0/SCORM_API.js"></script> -->
                <!-- <script>
                  // var API = getAPI();
                  // if (API) {
                  //   API.LMSInitialize("");
                  //   API.LMSSetValue("cmi.core.lesson_status", "completed");
                  //   API.LMSCommit("");
                  //   API.LMSFinish("");
                  // }
                </script> -->
            </body>
            </html>
          `;
          fs.writeFileSync(join(modulePath, 'index.html'), moduleHtmlContent);
          moduleFilesForResource.push(`${moduleFolderName}/index.html`);


          manifestItems.push(`
            <item identifier="ITEM-${uniqueCourseId}-${index + 1}" identifierref="RES-${uniqueCourseId}-${index + 1}" isvisible="true">
                <title>${module.titulo}</title>
            </item>
          `);
          manifestResources.push(`
            <resource identifier="RES-${uniqueCourseId}-${index + 1}" type="webcontent" adlcp:scormtype="sco" href="${moduleFolderName}/index.html">
                ${moduleFilesForResource.map(file => `<file href="${file}"/>`).join('')}
            </resource>
          `);


          moduleEntitiesToSave.push({
            titulo: module.titulo,
            descripcion: module.descripcion,
            videoUrl: videoUrlsInModule.length > 0 ? videoUrlsInModule[0] : null,
            pdfUrl: pdfUrlsInModule.length > 0 ? pdfUrlsInModule[0] : null,
          });
        }
      }



      const imsManifestContent = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="MANIFEST-${uniqueCourseId}" version="1.0"
    xmlns="http://www.imsproject.org/xsd/imscp_v1p1"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                        http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
    <metadata>
        <schema>ADL SCORM</schema>
        <schemaversion>1.2</schemaversion>
    </metadata>
    <organizations default="ORG-${uniqueCourseId}">
        <organization identifier="ORG-${uniqueCourseId}">
            <title>${courseData.titulo || 'Curso Generado'}</title>
            ${manifestItems.join('')}
        </organization>
    </organizations>
    <resources>
        ${manifestResources.join('')}
    </resources>
</manifest>`;
      fs.writeFileSync(join(scormTempDir, 'imsmanifest.xml'), imsManifestContent);


      const zip = new AdmZip();
      zip.addLocalFolder(scormTempDir);
      zip.writeZip(scormOutputZipPath);


      const finalZip = new AdmZip(scormOutputZipPath);
      finalZip.extractAllTo(scormUnzippedPath, /*overwrite*/ true);


      const scormPublicPath = `/scorm_courses/${uniqueCourseId}/imsmanifest.xml`;
      const nuevoCurso = await this.crearCurso({
        titulo: courseData.titulo || 'Curso Generado SCORM',
        descripcion: courseData.descripcion || 'Curso generado a partir de módulos.',
        precio: courseData.precio || 0, 
        duracionHoras: courseData.duracionHoras || 0,
        tipo: courseData.tipo || 'Docentes',
        categoria: courseData.categoria || 'Generado SCORM',
        modalidad: courseData.modalidad || 'grabado',
        certificadoDisponible: courseData.certificadoDisponible || false,
        badgeDisponible: courseData.badgeDisponible || false,
        imagenCurso: courseData.imagenCurso || null,
        archivoScorm: scormPublicPath,
        modulos: moduleEntitiesToSave, 
      });

      return { scormPath: scormPublicPath, nuevoCurso };

    } catch (error) {
      console.error('Error en generateScormPackage:', error);
      if (fs.existsSync(scormTempDir)) {
        fs.rmSync(scormTempDir, { recursive: true, force: true });
      }
      if (fs.existsSync(scormOutputZipPath)) {
        fs.unlinkSync(scormOutputZipPath);
      }
      if (fs.existsSync(scormUnzippedPath)) {
        fs.rmSync(scormUnzippedPath, { recursive: true, force: true });
      }
      throw error;
    }
  }
}
