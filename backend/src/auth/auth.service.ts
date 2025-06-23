import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entidades/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuarioYGenerarToken(
    correoElectronico: string,
    password: string,
  ): Promise<string | null> {
    const usuario = await this.usuariosService.encontrarPorCorreo(correoElectronico);

    if (!usuario) {
      return null;
    }

    const esValido = await bcrypt.compare(password, usuario.password);

    if (!esValido) {
      return null;
    }


    await this.usuariosService.update(usuario.id, {
      ultimaSesion: new Date(),
      estaConectado: true,
    });

    const payload = { sub: usuario.id, correoElectronico: usuario.correoElectronico };
    return this.jwtService.sign(payload);
  }


  async logout(userId: number): Promise<void> {
    await this.usuariosService.update(userId, { estaConectado: false });
  }
}