import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
