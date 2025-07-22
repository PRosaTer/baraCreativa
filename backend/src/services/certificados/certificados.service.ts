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
    const certificateId = 'BCERT_' + Math.random().toString(36).substring(2, 12).toUpperCase();

    const uploadsDir = path.join(process.cwd(), 'uploads');
    this.logger.log(`Directorio base para cargas (uploadsDir): ${uploadsDir}`);

    const baraCreativaLogoPath = path.join(uploadsDir, 'certificado.logo.png');
    const bombilloPath = path.join(uploadsDir, 'Bombillo.amarillo.png');
    const firmaPath = path.join(uploadsDir, 'Firma.Victor.Padilla.png');
    const dynamisPath = path.join(uploadsDir, 'LogotipoDynamisVerticalnegro.png');
    const selloBaraCreativaPath = path.join(uploadsDir, 'SelloBaraCreativaHN.png');

    let baraCreativaLogoBase64 = '';
    let bombilloBase64 = '';
    let firmaBase64 = '';
    let dynamisBase64 = '';
    let selloBaraCreativaBase64 = '';

    try {
      const logoBuffer = await fs.readFile(baraCreativaLogoPath);
      baraCreativaLogoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      this.logger.log(`Logo BaraCreativa cargado exitosamente.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el logo de BaraCreativa desde ${baraCreativaLogoPath}. Detalle: ${(error as Error).message}`);
      baraCreativaLogoBase64 = '';
    }

    try {
      const bombilloBuffer = await fs.readFile(bombilloPath);
      bombilloBase64 = `data:image/png;base64,${bombilloBuffer.toString('base64')}`;
      this.logger.log(`Icono bombillo cargado exitosamente.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el icono del bombillo desde ${bombilloPath}. Detalle: ${(error as Error).message}`);
      bombilloBase64 = '';
    }

    try {
      const firmaBuffer = await fs.readFile(firmaPath);
      firmaBase64 = `data:image/png;base64,${firmaBuffer.toString('base64')}`;
      this.logger.log(`Firma cargada exitosamente.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar la firma desde ${firmaPath}. Detalle: ${(error as Error).message}`);
      firmaBase64 = '';
    }

    try {
      const dynamisBuffer = await fs.readFile(dynamisPath);
      dynamisBase64 = `data:image/png;base64,${dynamisBuffer.toString('base64')}`;
      this.logger.log(`Logo Dynamis cargado exitosamente.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el logo de Dynamis desde ${dynamisPath}. Detalle: ${(error as Error).message}`);
      dynamisBase64 = '';
    }

    try {
      const selloBuffer = await fs.readFile(selloBaraCreativaPath);
      selloBaraCreativaBase64 = `data:image/png;base64,${selloBuffer.toString('base64')}`;
      this.logger.log(`Sello Bara Creativa cargado exitosamente.`);
    } catch (error) {
      this.logger.error(`ERROR: No se pudo cargar el sello de Bara Creativa desde ${selloBaraCreativaPath}. Detalle: ${(error as Error).message}`);
      selloBaraCreativaBase64 = '';
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
        dynamisBase64,
        selloBaraCreativaBase64,
        certificateId
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

  private async generateCertificateHtml(
    userName: string,
    courseTitle: string,
    issueDate: Date,
    baraCreativaLogoBase64: string,
    bombilloBase64: string,
    firmaBase64: string,
    dynamisBase64: string,
    selloBaraCreativaBase64: string,
    certificateId: string
  ): Promise<string> {
    const formattedDate = issueDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const signerName = 'Victor Manuel Padilla Rodriguez';
    const signerTitle = 'Director E-Learning Bara Creativa HN';

    const templatePath = path.join(process.cwd(), 'src', 'certificados', 'certificados.hbs');

    this.logger.log(`[generateCertificateHtml] Intentando cargar plantilla desde la ruta calculada: ${templatePath}`);

    let templateContent: string;
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8');
      this.logger.log(`[generateCertificateHtml] Plantilla 'certificados.hbs' encontrada y leída correctamente desde: ${templatePath}`);
    } catch (error) {
      this.logger.error(`[generateCertificateHtml] CRÍTICO: No se encontró la plantilla de certificado en ${templatePath}. Detalle del error: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error al cargar la plantilla del certificado. Por favor, asegúrese de que "certificados.hbs" exista en la ruta correcta con los permisos adecuados.');
    }

    const template = Handlebars.compile(templateContent);
    const html = template({
      userName,
      courseTitle,
      issueDate: formattedDate,
      certificateId,
      signerName,
      signerTitle,
      baraCreativaLogoBase64,
      certificadoLogoBase64: baraCreativaLogoBase64,
      bombilloBase64,
      firmaBase64,
      dynamisBase64,
      selloBaraCreativaBase64
    });

    return html;
  }

  private async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
        ],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

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
