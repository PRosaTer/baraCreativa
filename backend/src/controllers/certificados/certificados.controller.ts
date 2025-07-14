import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseGuards,
  Req,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CertificadosService } from '../../services/certificados/certificados.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import * as path from 'path';

interface AuthenticatedUser {
  id: number;
  correoElectronico: string;
  esAdmin: boolean;
  sub: number;
}

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@ApiTags('certificados')
@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @Post(':cursoId/generar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generar un certificado para un curso completado' })
  @ApiResponse({ status: 201, description: 'Certificado generado y descargado exitosamente.' })
  @ApiResponse({ status: 400, description: 'El curso no ha sido completado o ya existe un certificado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Usuario o curso no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor al generar el certificado.' })
  async generarCertificado(
    @Req() req: RequestWithUser,
    @Param('cursoId') cursoId: string,
    @Res() res: Response,
  ) {
    const usuarioId = req.user?.id ?? req.user?.sub;
    if (!usuarioId || isNaN(usuarioId)) {
      throw new UnauthorizedException('Usuario no autenticado o ID inválido.');
    }

    const cursoIdNum = parseInt(cursoId, 10);
    if (isNaN(cursoIdNum)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'El ID del curso no es válido.' });
    }

    try {
      const filePath = await this.certificadosService.generarCertificado(usuarioId, cursoIdNum);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
      res.sendFile(filePath);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return res.status(error.getStatus()).json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error al generar el certificado.', error: (error as Error).message });
    }
  }

  // Mueve esta ruta AHORA antes de la ruta parametrizada :certificadoId
  @Get('mis-certificados')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los certificados del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de certificados del usuario.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async getMisCertificados(@Req() req: RequestWithUser) {
    const usuarioId = req.user?.id ?? req.user?.sub;
    if (!usuarioId || isNaN(usuarioId)) {
      throw new UnauthorizedException('Usuario no autenticado o ID inválido.');
    }

    return this.certificadosService.getCertificadosByUsuario(usuarioId);
  }

  @Get(':certificadoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un certificado por su ID' })
  @ApiResponse({ status: 200, description: 'Certificado obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado al certificado.' })
  @ApiResponse({ status: 404, description: 'Certificado no encontrado.' })
  async getCertificado(
    @Req() req: RequestWithUser,
    @Param('certificadoId') certificadoId: string,
    @Res() res: Response,
  ) {
    const usuarioId = req.user?.id ?? req.user?.sub;
    if (!usuarioId || isNaN(usuarioId)) {
      throw new UnauthorizedException('Usuario no autenticado o ID inválido.');
    }

    const certIdNum = parseInt(certificadoId, 10);
    if (isNaN(certIdNum)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'El ID del certificado no es válido.' });
    }

    try {
      const certificado = await this.certificadosService.getCertificadoById(certIdNum);

      if (certificado.usuario.id !== usuarioId) {
        throw new BadRequestException('Acceso denegado a este certificado.');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(certificado.rutaArchivo)}"`);
      res.sendFile(certificado.rutaArchivo);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return res.status(error.getStatus()).json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error al obtener el certificado.', error: (error as Error).message });
    }
  }
}
