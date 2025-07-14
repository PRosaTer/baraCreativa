import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { ReporteProgresoService } from '../../services/reporte-progreso/reporte-progreso.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MarcarModuloCompletadoDto, EstadoModuloUsuario } from '../../interfaces/reporte-progreso.interface';
import { Usuario } from '../../entidades/usuario.entity';
import { ModuloEntity } from '../../entidades/modulo.entity';
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

      let urlContenido: string | null = null;
      let descripcionContenido: string | null = modulo.descripcion;

      if (modulo.tipo === 'video' && modulo.videoUrl) {
          urlContenido = modulo.videoUrl;
      } else if (modulo.tipo === 'pdf' && modulo.pdfUrl) {
          urlContenido = modulo.pdfUrl;
      } else if (modulo.tipo === 'imagen' && modulo.imageUrl) {
          urlContenido = modulo.imageUrl;
      } else if (modulo.tipo === 'scorm' && modulo.curso && modulo.curso.archivoScorm) {
          urlContenido = `http://localhost:3001${modulo.curso.archivoScorm}`;
      }

      return {
        id: modulo.id,
        titulo: modulo.titulo,
        tipo: modulo.tipo,
        orden: modulo.orden,
        urlContenido: urlContenido,
        descripcionContenido: descripcionContenido,
        completado: completado,
        fechaCompletado: fechaCompletado,
      };
    });

    this.logger.log(`Estado de módulos para curso ${cursoId} y usuario ${req.user.id} obtenido.`);
    return estadoModulos;
  }
}
