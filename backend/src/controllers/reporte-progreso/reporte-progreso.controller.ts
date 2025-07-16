import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { ReporteProgresoService } from '../../services/reporte-progreso/reporte-progreso.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MarcarModuloCompletadoDto, EstadoModuloUsuario } from '../../interfaces/reporte-progreso.interface';
import { Usuario } from '../../entidades/usuario.entity';
import { ModuloEntity, TipoModulo } from '../../entidades/modulo.entity'; 
import { ReporteProgresoEntity } from '../../entidades/ReporteProgreso.entity'; 

interface RequestConUsuario extends Request {
  user: Usuario;
}

@Controller('reportes-progreso')
export class ReporteProgresoController {
  private readonly logger = new Logger(ReporteProgresoController.name);

  constructor(private readonly reporteProgresoService: ReporteProgresoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('marcar-completado')
  async marcarModuloCompletado(
    @Req() req: RequestConUsuario,
    @Body() dto: MarcarModuloCompletadoDto,
  ) {
    this.logger.log(`Recibida solicitud para marcar módulo completado: Usuario ${req.user.id}, Curso ${dto.cursoId}, Módulo ${dto.moduloId}`);
    const reporte = await this.reporteProgresoService.marcarModuloCompletado(req.user.id, dto);
    return { mensaje: 'Módulo marcado como completado', reporte };
  }

  @UseGuards(JwtAuthGuard)
  @Get('estado/:cursoId')
  async obtenerEstadoModulos(
    @Req() req: RequestConUsuario,
    @Param('cursoId', ParseIntPipe) cursoId: number,
  ): Promise<EstadoModuloUsuario[]> {
    this.logger.log(`Recibida solicitud para obtener estado de módulos: Usuario ${req.user.id}, Curso ${cursoId}`);

    const modulosDelCurso = await this.reporteProgresoService['moduloRepository'].find({
      where: { curso: { id: cursoId } },
      relations: ['curso'], 
      order: { orden: 'ASC', id: 'ASC' },
    });

    const progresoUsuario = await this.reporteProgresoService.obtenerProgresoModulosUsuario(req.user.id, cursoId);

    const progresoMap = new Map<number, ReporteProgresoEntity>();
    progresoUsuario.forEach(p => progresoMap.set(p.modulo.id, p));

    const estadoModulos: EstadoModuloUsuario[] = modulosDelCurso.map(modulo => {
      const completado = progresoMap.has(modulo.id) ? progresoMap.get(modulo.id)!.completado : false;
      const fechaCompletado = completado ? progresoMap.get(modulo.id)!.fechaCompletado : null;


      let videoUrls: string[] | null = null;
      let pdfUrls: string[] | null = null;
      let imageUrls: string[] | null = null;
      let urlContenidoScorm: string | null = null;

      let descripcionContenido: string | null = modulo.descripcion;

      this.logger.debug(`[EstadoModulos] Modulo ID: ${modulo.id}, Titulo: ${modulo.titulo}, Tipo en DB: ${modulo.tipo}, videoUrl: ${modulo.videoUrl}, pdfUrl: ${modulo.pdfUrl}, imageUrl: ${modulo.imageUrl}`);


      if (modulo.videoUrl && modulo.videoUrl.length > 0) {
          videoUrls = modulo.videoUrl.map(url => `http://localhost:3001${url}`);
          this.logger.debug(`[EstadoModulos] Asignado video URLs: ${JSON.stringify(videoUrls)}`);
      }
      if (modulo.pdfUrl && modulo.pdfUrl.length > 0) {
          pdfUrls = modulo.pdfUrl.map(url => `http://localhost:3001${url}`);
          this.logger.debug(`[EstadoModulos] Asignado PDF URLs: ${JSON.stringify(pdfUrls)}`);
      }
      if (modulo.imageUrl && modulo.imageUrl.length > 0) {
          imageUrls = modulo.imageUrl.map(url => `http://localhost:3001${url}`);
          this.logger.debug(`[EstadoModulos] Asignado imagen URLs: ${JSON.stringify(imageUrls)}`);
      }
      

      if (modulo.tipo === TipoModulo.SCORM && modulo.curso && modulo.curso.archivoScorm) { 
          urlContenidoScorm = `http://localhost:3001${modulo.curso.archivoScorm}`;
          this.logger.debug(`[EstadoModulos] Asignado SCORM URL: ${urlContenidoScorm}`);
      } else if (modulo.tipo === TipoModulo.TEXTO) { 
          this.logger.debug(`[EstadoModulos] Modulo tipo TEXTO, sin URL de archivo.`);
      } else {
          this.logger.warn(`[EstadoModulos] Modulo ID: ${modulo.id} con tipo ${modulo.tipo} no manejado o URL faltante.`);
      }

      return {
        id: modulo.id,
        titulo: modulo.titulo,
        tipo: modulo.tipo,
        orden: modulo.orden,
        videoUrls: videoUrls,
        pdfUrls: pdfUrls,
        imageUrls: imageUrls,
        urlContenido: urlContenidoScorm,
        descripcionContenido: descripcionContenido,
        completado: completado,
        fechaCompletado: fechaCompletado,
      };
    });

    this.logger.log(`Estado de módulos para curso ${cursoId} y usuario ${req.user.id} obtenido.`);
    return estadoModulos;
  }
}
