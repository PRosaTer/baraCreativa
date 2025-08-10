import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Usuario } from '../../entidades/usuario.entity';
import { SocketGateway } from '../../socket/socket.gateway';
import { RequestPasswordResetDto } from '../../dto/password/request-password-reset.dto';
import { ResetPasswordDto } from '../../dto/password/reset-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUsuarioDto } from '../../dto/crear-editar-usuarios/create-usuario.dto';

interface UserRequest extends Request {
  user: Usuario;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('registro')
  async registro(@Body() datos: CreateUsuarioDto) {
    const usuarioExistente = await this.usuariosService.encontrarPorCorreo(datos.correoElectronico);
    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }
    const nuevoUsuario = await this.usuariosService.create({
      ...datos,
      esAdmin: datos.tipoUsuario === 'Admin',
    });
    return { message: 'Usuario registrado correctamente', usuario: nuevoUsuario };
  }

  @Post('login')
  async login(
    @Body() datos: { correoElectronico: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.validarUsuarioYGenerarToken(
      datos.correoElectronico,
      datos.password,
    );

    if (!token) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    const usuario = await this.usuariosService.encontrarPorCorreo(datos.correoElectronico);
    if (usuario) {
      await this.usuariosService.actualizarEstado(usuario.id, true);
      const usuarios = await this.usuariosService.findAll();
      this.socketGateway.server.emit('usuariosActualizados', usuarios);
    }

    return { message: 'Login exitoso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response) {
    await this.usuariosService.actualizarEstado(req.user.id, false);
    res.clearCookie('jwt', { path: '/' });
    const usuarios = await this.usuariosService.findAll();
    this.socketGateway.server.emit('usuariosActualizados', usuarios);
    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  async getAllUsersForAdmin(@Req() req: UserRequest): Promise<Usuario[]> {
    if (!req.user.esAdmin) {
      throw new UnauthorizedException('Acceso no autorizado. Solo para administradores.');
    }
    return this.usuariosService.findAll();
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(requestPasswordResetDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }
}
