// src/certificados/certificados.service.ts
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { Certificado } from '../../entidades/certificado.entity';
import { Usuario } from '../../entidades/usuario.entity';
import { Curso } from '../../entidades/curso.entity';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity'; 
import { Inscripcion } from '../../entidades/inscripcion.entity';

@Injectable()
export class CertificadosService {
  private readonly logger = new Logger(CertificadosService.name);

  constructor(
    @InjectRepository(Certificado)
    private certificadosRepository: Repository<Certificado>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Curso)
    private cursosRepository: Repository<Curso>,
    @InjectRepository(ReporteProgresoEntity) 
    private reporteProgresoRepository: Repository<ReporteProgresoEntity>,
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
  ) {}

  /**
   * Genera un certificado para un usuario y curso específicos.
   * @param usuarioId El ID del usuario.
   * @param cursoId El ID del curso.
   * @returns La ruta al certificado generado en formato PDF.
   */
  async generarCertificado(usuarioId: number, cursoId: number): Promise<string> {
    this.logger.log(`Iniciando generación de certificado para Usuario ID: ${usuarioId}, Curso ID: ${cursoId}`);


    const usuario = await this.usuariosRepository.findOne({ where: { id: usuarioId } });
    const curso = await this.cursosRepository.findOne({ where: { id: cursoId } });

    if (!usuario) {
      this.logger.error(`Usuario con ID ${usuarioId} no encontrado.`);
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }
    if (!curso) {
      this.logger.error(`Curso con ID ${cursoId} no encontrado.`);
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado.`);
    }
    this.logger.log(`Usuario "${usuario.nombreCompleto}" y Curso "${curso.titulo}" encontrados.`);


    const inscripcion = await this.inscripcionRepository.findOne({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
      relations: ['usuario', 'curso'],
    });

    if (!inscripcion) {
      this.logger.error(`Inscripción no encontrada para Usuario ID: ${usuarioId} y Curso ID: ${cursoId}.`);
      throw new BadRequestException(`El usuario ${usuario.nombreCompleto} no está inscrito en el curso "${curso.titulo}".`);
    }

    if (!inscripcion.cursoCompletado) {
      this.logger.warn(`El usuario ${usuario.nombreCompleto} NO ha completado el curso "${curso.titulo}".`);
      throw new BadRequestException(`El usuario ${usuario.nombreCompleto} no ha completado el curso "${curso.titulo}".`);
    }
    this.logger.log(`Usuario "${usuario.nombreCompleto}" ha completado el curso "${curso.titulo}".`);



    const certificadoExistente = await this.certificadosRepository.findOne({
      where: { usuario: { id: usuarioId }, curso: { id: cursoId } },
    });

    if (certificadoExistente) {
      this.logger.warn(`Certificado ya existe para usuario ${usuarioId} y curso ${cursoId}. Devolviendo el existente: ${certificadoExistente.rutaArchivo}`);
      return certificadoExistente.rutaArchivo;
    }
    this.logger.log(`No existe un certificado previo para Usuario ID: ${usuarioId} y Curso ID: ${cursoId}. Procediendo a generar uno nuevo.`);

    const fechaEmision = new Date();
    const nombreCurso = curso.titulo;
    const nombreUsuario = usuario.nombreCompleto;


    const uploadsDir = path.join(process.cwd(), 'uploads');
    this.logger.log(`Directorio base para cargas (uploadsDir): ${uploadsDir}`);

    const baraCreativaLogoPath = path.join(uploadsDir, 'logo-bc.png');
    const bombilloPath = path.join(uploadsDir, 'bombillo.png');
    const firmaPath = path.join(uploadsDir, 'firma.png');
    const dynamisPath = path.join(uploadsDir, 'dynamis.png');

    let baraCreativaLogoBase64: string = '';
    let bombilloBase64: string = '';
    let firmaBase64: string = '';
    let dynamisBase64: string = '';

    try {
      const logoBuffer = await fs.readFile(baraCreativaLogoPath);
      baraCreativaLogoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      this.logger.log(`Logo BaraCreativa cargado exitosamente desde: ${baraCreativaLogoPath}`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el logo de BaraCreativa desde ${baraCreativaLogoPath}. Asegúrate de que la ruta sea correcta y el archivo exista. Detalle: ${(error as Error).message}`);
      baraCreativaLogoBase64 = ''; 
    }

    try {
      const bombilloBuffer = await fs.readFile(bombilloPath);
      bombilloBase64 = `data:image/png;base64,${bombilloBuffer.toString('base64')}`;
      this.logger.log(`Icono bombillo cargado exitosamente desde: ${bombilloPath}`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el icono del bombillo desde ${bombilloPath}. Detalle: ${(error as Error).message}`);
      bombilloBase64 = '';
    }

    try {
      const firmaBuffer = await fs.readFile(firmaPath);
      firmaBase64 = `data:image/png;base64,${firmaBuffer.toString('base64')}`;
      this.logger.log(`Firma cargada exitosamente desde: ${firmaPath}`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar la firma desde ${firmaPath}. Detalle: ${(error as Error).message}`);
      firmaBase64 = '';
    }

    try {
      const dynamisBuffer = await fs.readFile(dynamisPath);
      dynamisBase64 = `data:image/png;base64,${dynamisBuffer.toString('base64')}`;
      this.logger.log(`Logo Dynamis cargado exitosamente desde: ${dynamisPath}`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el logo de Dynamis desde ${dynamisPath}. Detalle: ${(error as Error).message}`);
      dynamisBase64 = '';
    }

    let htmlContent: string;
    try {
        htmlContent = await this.generateCertificateHtml(
            nombreUsuario,
            nombreCurso,
            fechaEmision,
            baraCreativaLogoBase64,
            bombilloBase64,
            firmaBase64,
            dynamisBase64
        );
        this.logger.log(`Contenido HTML del certificado generado con éxito.`);
    } catch (error) {
        this.logger.error(`ERROR al generar el contenido HTML del certificado: ${(error as Error).message}`);
        throw new InternalServerErrorException('Error al generar el contenido HTML del certificado.');
    }



    let pdfBuffer: Buffer;
    try {
        pdfBuffer = await this.generatePdfFromHtml(htmlContent);
        this.logger.log(`PDF generado con éxito a partir del HTML.`);
    } catch (error) {
        this.logger.error(`ERROR al generar el PDF con Puppeteer: ${(error as Error).message}`);
        throw new InternalServerErrorException('Error al generar el certificado PDF.');
    }

    const certificadosDir = path.join(uploadsDir, 'certificados');
    try {
      await fs.mkdir(certificadosDir, { recursive: true });
      this.logger.log(`Directorio de certificados '${certificadosDir}' asegurado.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo crear/asegurar el directorio de certificados '${certificadosDir}'. Detalle: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error al preparar el directorio para guardar el certificado.');
    }

    const fileName = `certificado_${usuarioId}_${cursoId}_${Date.now()}.pdf`;
    const filePath = path.join(certificadosDir, fileName);

    try {
      await fs.writeFile(filePath, pdfBuffer);
      this.logger.log(`Certificado PDF guardado exitosamente en el sistema de archivos: ${filePath}`);
    } catch (error) {
      this.logger.error(`ERROR al guardar el certificado PDF en ${filePath}. Detalle: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error al guardar el certificado PDF en el sistema de archivos.');
    }


    const nuevoCertificado = this.certificadosRepository.create({
      usuario,
      curso,
      nombreCurso: curso.titulo,
      fechaEmision,
      rutaArchivo: filePath,
    });

    try {
      await this.certificadosRepository.save(nuevoCertificado);
      this.logger.log(`Certificado registrado exitosamente en la base de datos para usuario ${usuarioId} y curso ${cursoId}.`);
    } catch (error) {
      this.logger.error(`CRÍTICO: ERROR al registrar el certificado en la base de datos para usuario ${usuarioId} y curso ${cursoId}. Detalle: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error al registrar el certificado en la base de datos. Por favor, revise los logs del servidor para más detalles.');
    }

    return filePath;
  }

  /**
   * Genera el contenido HTML del certificado.
   * @param userName Nombre del usuario.
   * @param courseTitle Título del curso.
   * @param issueDate Fecha de emisión.
   * @param baraCreativaLogoBase64 String Base64 del logo de BaraCreativa.
   * @param bombilloBase64 String Base64 del icono del bombillo.
   * @param firmaBase64 String Base64 de la imagen de la firma.
   * @param dynamisBase64 String Base64 del logo de Dynamis.
   * @returns String con el contenido HTML.
   */
  private async generateCertificateHtml(
    userName: string,
    courseTitle: string,
    issueDate: Date,
    baraCreativaLogoBase64: string,
    bombilloBase64: string,
    firmaBase64: string,
    dynamisBase64: string
  ): Promise<string> {
    const formattedDate = issueDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const signerName = 'Victor Padilla';
    const signerTitle = 'CEO de Bara Creativa';
    const templatePath = path.join(process.cwd(), 'src', 'certificados', 'certificados.hbs');

    // --- LOGS DE DEPURACIÓN PARA LA PLANTILLA HBS ---
    this.logger.log(`[generateCertificateHtml] Directorio de trabajo actual (process.cwd()): ${process.cwd()}`);
    this.logger.log(`[generateCertificateHtml] Intentando cargar plantilla desde la ruta calculada: ${templatePath}`);
    // --- FIN LOGS DE DEPURACIÓN ---

    let templateContent: string;
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8');
      this.logger.log(`[generateCertificateHtml] Plantilla 'certificados.hbs' encontrada y leída correctamente desde: ${templatePath}`);
    } catch (error) {
      this.logger.error(`[generateCertificateHtml] ERROR: No se encontró la plantilla de certificado en ${templatePath}. Usando plantilla por defecto. Detalle del error: ${(error as Error).message}`);
      templateContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificado de Finalización</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f0f2f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .certificate-container {
              width: 297mm; /* A4 width */
              height: 210mm; /* A4 height */
              border: 10px solid #0056b3; /* Azul profesional */
              padding: 25mm; /* Más padding */
              box-sizing: border-box;
              background: linear-gradient(to bottom right, #ffffff, #f8fafd); /* Fondo suave */
              text-align: center;
              position: relative;
              overflow: hidden;
              box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Sombra pronunciada */
              border-radius: 15px; /* Bordes redondeados */
            }
            .header-main {
                display: flex;
                align-items: center; /* Alinea verticalmente el logo y el título */
                justify-content: center; /* Centra el bloque completo */
                margin-bottom: 20px;
                flex-wrap: nowrap; /* Evita que los elementos se envuelvan */
            }
            .bara-creativa-logo-inline {
                height: 60px; /* Ajusta el tamaño del logo */
                width: auto;
                margin-right: 20px; /* Espacio entre el logo y el título */
                object-fit: contain; /* Asegura que la imagen se ajuste sin distorsión */
            }
            .main-title {
              font-family: 'Playfair Display', serif; /* Fuente más elegante para el título */
              font-size: 3.8em; /* Tamaño más grande */
              font-weight: 700;
              color: #0056b3;
              margin: 0;
              line-height: 1.1;
              text-transform: uppercase;
            }
            .subtitle {
              font-size: 1.6em;
              color: #333;
              margin-top: 10px;
              font-weight: 300;
            }
            .recipient-name {
              font-family: 'Playfair Display', serif;
              font-size: 3.2em;
              font-weight: 700;
              color: #2c3e50;
              margin: 30px 0 20px 0;
              text-transform: uppercase;
            }
            .content-area {
              margin-top: 20px;
            }
            .course-title {
              font-size: 2.4em;
              font-weight: 700;
              color: #00796b; /* Un verde complementario */
              margin-bottom: 15px;
            }
            .completion-info {
              font-size: 1.4em;
              color: #555;
              margin-bottom: 30px;
            }
            .description {
              font-size: 1.2em;
              color: #444;
              line-height: 1.8; /* Mayor interlineado para legibilidad */
              max-width: 85%;
              margin: 0 auto 50px auto;
            }
            .signature-area {
              display: flex;
              justify-content: space-around;
              width: 90%;
              margin: 0 auto 30px auto;
            }
            .signature-block {
              text-align: center;
              width: 45%;
              padding-top: 20px;
            }
            .signature-line {
              border-top: 2px solid #999;
              margin-bottom: 8px;
            }
            .signer-name {
              font-weight: 700;
              color: #333;
              font-size: 1.1em;
            }
            .signer-title {
              font-size: 0.9em;
              color: #777;
            }
            .footer-id {
              position: absolute;
              bottom: 10mm; /* Posicionado más abajo */
              left: 50%;
              transform: translateX(-50%);
              font-size: 0.8em;
              color: #999;
              width: calc(100% - 50mm); /* Ajustar ancho para que no se superponga con el borde */
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="header-main">
              ${baraCreativaLogoBase64 ? `<img src="${baraCreativaLogoBase64}" alt="Bara Creativa Logo" class="bara-creativa-logo-inline">` : ''}
              <h1 class="main-title">CERTIFICADO DE FINALIZACIÓN</h1>
            </div>

            <p class="subtitle">¡Felicidades!</p>
            <p class="recipient-name">${userName}</p>

            <div class="content-area">
              <h2 class="course-title">${courseTitle}</h2>
              <p class="completion-info">Curso completado el ${formattedDate}</p>

              <p class="description">
                Por haber completado exitosamente el curso, demostrando dedicación y un profundo
                conocimiento en la materia. Tu compromiso con el aprendizaje continuo es un ejemplo
                y te permitirá alcanzar nuevas metas profesionales.
              </p>

              <div class="signature-area">
                <div class="signature-block">
                  <div class="signature-line"></div>
                  <p class="signer-name">${signerName}</p>
                  <p class="signer-title">${signerTitle}</p>
                </div>
                <div class="signature-block">
                  <div class="signature-line"></div>
                  <p class="signer-name">Bara Creativa Team</p>
                  <p class="signer-title">Equipo de Desarrollo y Contenido</p>
                </div>
              </div>
            </div>
            <p class="footer-id">ID del certificado: ${'BCERT_' + Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
          </div>
        </body>
        </html>
      `;
    }

    const template = Handlebars.compile(templateContent);
    const html = template({
      userName,
      courseTitle,
      issueDate: formattedDate,
      certificateId: 'BCERT_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      signerName,
      signerTitle,
      baraCreativaLogoBase64,
      certificadoLogoBase64: baraCreativaLogoBase64, 
      bombilloBase64: bombilloBase64,
      firmaBase64: firmaBase64,
      dynamisBase64: dynamisBase64
    });

    return html;
  }

  /**
   * Convierte contenido HTML en un buffer PDF usando Puppeteer.
   * @param htmlContent El contenido HTML a convertir.
   * @returns Un Buffer que contiene los datos del PDF.
   */
  private async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 1000)); 


      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true, 
        margin: {
          top: '0mm',  
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      });
      return pdfBuffer;
    } catch (error) {
      this.logger.error(`ERROR Puppeteer: Error al generar el PDF. Detalle: ${(error as Error).message}`);
      if ((error as Error).message.includes('Executable path not found')) {
        this.logger.error('Sugerencia: Asegúrate de que Chromium esté instalado y sea accesible por Puppeteer. En Docker, esto a menudo requiere instalar paquetes adicionales.');
      }
      throw new InternalServerErrorException('Error al generar el certificado PDF.');
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('Navegador Puppeteer cerrado.');
      }
    }
  }

  /**
   * Obtiene un certificado por su ID.
   * @param certificadoId El ID del certificado.
   * @returns El objeto Certificado.
   */
  async getCertificadoById(certificadoId: number): Promise<Certificado> {
    this.logger.log(`Buscando certificado por ID: ${certificadoId}`);
    const certificado = await this.certificadosRepository.findOne({
      where: { id: certificadoId },
      relations: ['usuario', 'curso'],
    });
    if (!certificado) {
      this.logger.warn(`Certificado con ID ${certificadoId} no encontrado.`);
      throw new NotFoundException(`Certificado con ID ${certificadoId} no encontrado.`);
    }
    this.logger.log(`Certificado ID: ${certificadoId} encontrado.`);
    return certificado;
  }

  /**
   * Obtiene certificados por usuario.
   * @param usuarioId El ID del usuario.
   * @returns Un array de objetos Certificado.
   */
  async getCertificadosByUsuario(usuarioId: number): Promise<Certificado[]> {
    this.logger.log(`Buscando certificados para Usuario ID: ${usuarioId}`);
    const certificados = await this.certificadosRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['curso'],
    });
    this.logger.log(`Se encontraron ${certificados.length} certificados para Usuario ID: ${usuarioId}.`);
    return certificados;
  }
}
