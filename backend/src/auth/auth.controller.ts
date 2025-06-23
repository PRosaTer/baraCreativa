import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../entidades/usuario.entity';

interface UserRequest extends Request {
  user: Usuario;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService,
  ) {}

  @Post('login')
  async login(@Body() datos: { correoElectronico: string; password: string }) {
    const token = await this.authService.validarUsuarioYGenerarToken(
      datos.correoElectronico,
      datos.password,
    );

    if (!token) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return { access_token: token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: UserRequest) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: UserRequest) {
    await this.usuariosService.logout(req.user.id);
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
