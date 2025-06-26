import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../entidades/usuario.entity';
import { SocketGateway } from '../socket/socket.gateway';

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
      sameSite: 'lax',
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

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response) {
    await this.usuariosService.actualizarEstado(req.user.id, false);

    res.clearCookie('jwt', { path: '/' });

    const usuarios = await this.usuariosService.findAll();
    this.socketGateway.server.emit('usuariosActualizados', usuarios);

    return { message: 'Sesión cerrada correctamente' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/users')
  async getAllUsersForAdmin(@Req() req: UserRequest): Promise<Usuario[]> {
    if (!req.user.esAdmin) {
      throw new UnauthorizedException('Acceso no autorizado. Solo para administradores.');
    }
    return this.usuariosService.findAll();
  }
}
