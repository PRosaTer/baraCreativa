import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReporteProgresoService } from '../../services/reporte-progreso/reporte-progreso.service';
import { CursosService } from '../../services/cursos/cursos.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MarcarModuloCompletadoDto, EstadoModuloUsuario } from '../../interfaces/reporte-progreso.interface';
import { Usuario } from '../../entidades/usuario.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity';
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity';
import { Curso } from '../../entidades/curso.entity';
import { Not } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

interface RequestConUsuario extends Request {
  user: Usuario;
}

const SCORM_VIRTUAL_MODULE_ID_OFFSET = 1000000;

@ApiTags('reportes-progreso')
@Controller('reportes-progreso')
export class ReporteProgresoController {
  private readonly logger = new Logger(ReporteProgresoController.name);

  constructor(
    private readonly reporteProgresoService: ReporteProgresoService,
    private readonly cursosService: CursosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('marcar-completado')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Módulo marcado como completado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Usuario, curso o módulo no encontrado.' })
  @ApiBody({ type: MarcarModuloCompletadoDto })
  async marcarModuloCompletado(
    @Req() req: RequestConUsuario,
    @Body() dto: MarcarModuloCompletadoDto,
  ) {
    this.logger.log(`[Controller] Recibida solicitud marcar-completado. moduloId: ${dto.moduloId}, cursoId: ${dto.cursoId}`);

    const expectedScormVirtualId = dto.cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET;
    this.logger.log(`[Controller] SCORM_VIRTUAL_MODULE_ID_OFFSET: ${SCORM_VIRTUAL_MODULE_ID_OFFSET}`);
    this.logger.log(`[Controller] Expected SCORM Virtual ID for cursoId ${dto.cursoId}: ${expectedScormVirtualId}`);
    this.logger.log(`[Controller] Comparando dto.moduloId (${dto.moduloId}) con expectedScormVirtualId (${expectedScormVirtualId}). Resultado: ${dto.moduloId === expectedScormVirtualId}`);


    if (dto.moduloId === expectedScormVirtualId) {
        this.logger.log(`[Controller] Modulo ${dto.moduloId} detectado como SCORM virtual. Llamando a marcarSCORMCompletado.`);
        const reporte = await this.reporteProgresoService.marcarSCORMCompletado(req.user.id, dto.cursoId);
        return { mensaje: 'Módulo SCORM marcado como completado', reporte };
    } else if (dto.moduloId <= 0) { 
        this.logger.warn(`[Controller] ID de módulo inválido detectado: ${dto.moduloId}.`);
        throw new BadRequestException('ID de módulo inválido. Debe ser un ID de módulo real de la base de datos o el ID virtual de SCORM.');
    }

    this.logger.log(`[Controller] Modulo ${dto.moduloId} detectado como módulo regular. Llamando a marcarModuloCompletado.`);
    const reporte = await this.reporteProgresoService.marcarModuloCompletado(req.user.id, dto);
    return { mensaje: 'Módulo marcado como completado', reporte };
  }

  @UseGuards(JwtAuthGuard)
  @Get('estado/:cursoId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Progreso de módulos obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiParam({ name: 'cursoId', type: Number, description: 'ID del curso' })
  async obtenerEstadoModulos(
    @Req() req: RequestConUsuario,
    @Param('cursoId', ParseIntPipe) cursoId: number,
  ): Promise<EstadoModuloUsuario[]> {
    const curso = await this.cursosService.obtenerCursoPorId(cursoId);
    if (!curso) {
      throw new NotFoundException(`Curso con ID ${cursoId} no encontrado.`);
    }

    const todosLosModulosRegularesDelCurso = await this.reporteProgresoService['moduloRepository'].find({
      where: {
        curso: { id: cursoId },
        tipo: Not(TipoModulo.SCORM) 
      },
      order: { orden: 'ASC', id: 'ASC' }, 
    });

    const progresoUsuario = await this.reporteProgresoService.obtenerProgresoModulosUsuario(req.user.id, cursoId);

    const progresoMap = new Map<number, ReporteProgresoEntity>();
    progresoUsuario.forEach(p => progresoMap.set(p.modulo.id, p));

    let estadoModulos: EstadoModuloUsuario[] = [];

    if (curso.archivoScorm) {
        const scormVirtualId = cursoId + SCORM_VIRTUAL_MODULE_ID_OFFSET;
        const scormReporte = progresoMap.get(scormVirtualId);
        const scormCompletado = scormReporte?.completado ?? false;
        const scormFechaCompletado = scormReporte?.fechaCompletado ?? null;

        const scormUrlCompleta = `http://localhost:3001/scorm_courses${curso.archivoScorm}`;

        estadoModulos.push({
            id: scormVirtualId, 
            titulo: curso.titulo + ' (Módulo SCORM Principal)', 
            tipo: TipoModulo.SCORM,
            orden: 0, 
            videoUrls: null,
            pdfUrls: null,
            imageUrls: null,
            urlContenido: scormUrlCompleta, 
            descripcionContenido: curso.descripcion || 'Contenido SCORM del curso.',
            completado: scormCompletado,
            fechaCompletado: scormFechaCompletado,
        });
    }

    for (const modulo of todosLosModulosRegularesDelCurso) {
        const completado = progresoMap.has(modulo.id) ? progresoMap.get(modulo.id)!.completado : false;
        const fechaCompletado = completado ? progresoMap.get(modulo.id)!.fechaCompletado : null;

        let videoUrls: string[] | null = null;
        let pdfUrls: string[] | null = null;
        let imageUrls: string[] | null = null;
        let descripcionContenido: string | null = null;

        if (modulo.videoUrl && modulo.videoUrl.length > 0) {
            videoUrls = modulo.videoUrl.map(url => `http://localhost:3001${url}`);
        }
        if (modulo.pdfUrl && modulo.pdfUrl.length > 0) {
            pdfUrls = modulo.pdfUrl.map(url => `http://localhost:3001${url}`);
        }
        if (modulo.imageUrl && modulo.imageUrl.length > 0) {
            imageUrls = modulo.imageUrl.map(url => `http://localhost:3001${url}`);
        }
        descripcionContenido = modulo.descripcion;

        estadoModulos.push({
            id: modulo.id, 
            titulo: modulo.titulo,
            tipo: modulo.tipo,
            orden: modulo.orden,
            videoUrls: videoUrls,
            pdfUrls: pdfUrls,
            imageUrls: imageUrls,
            urlContenido: null, 
            descripcionContenido: descripcionContenido,
            completado: completado,
            fechaCompletado: fechaCompletado,
        });
    }

    estadoModulos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    return estadoModulos;
  }
}