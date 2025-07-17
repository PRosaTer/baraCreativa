import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Logger,
  NotFoundException,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InscripcionesService } from '../../services/inscripciones/inscripciones.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

interface UserRequest extends Request {
  user: { id: number };
}

@UseGuards(JwtAuthGuard)
@Controller('inscripciones')
export class InscripcionesController {
  private readonly logger = new Logger(InscripcionesController.name);

  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post('mark-completed/:cursoId')
  async markCompleted(
    @Param('cursoId', ParseIntPipe) cursoId: number,
    @Req() req: UserRequest,
  ) {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    this.logger.log(`Marcando completado curso ${cursoId} para usuario ${usuarioId}`);

    const inscripcion = await this.inscripcionesService.findByUserAndCourse(usuarioId, cursoId);
    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada para usuario y curso');
    }

    const inscripcionActualizada = await this.inscripcionesService.updateInscripcionEstado(inscripcion.id, 'Completado');

    return { message: 'Curso marcado como completado', inscripcion: inscripcionActualizada };
  }

  @Get('estado/:cursoId')
  async estadoInscripcion(
    @Param('cursoId', ParseIntPipe) cursoId: number,
    @Req() req: UserRequest,
  ) {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    this.logger.log(`Verificando inscripción para usuario ${usuarioId} y curso ${cursoId}`);

    const inscripcion = await this.inscripcionesService.findByUserAndCourse(usuarioId, cursoId);
    if (!inscripcion) {
      throw new NotFoundException('No estás inscripto en el curso');
    }

    return { estaInscripto: true };
  }

  @Get('mis-cursos')
  async misCursos(@Req() req: UserRequest) {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    this.logger.log(`Obteniendo cursos para usuario ${usuarioId}`);

    const cursos = await this.inscripcionesService.obtenerCursosPorUsuario(usuarioId);
    return cursos; 
  }
}
