import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    console.log('Usuario encontrado:', usuario);

    if (!usuario) return null;

    const esValido = await bcrypt.compare(password, usuario.password);
    console.log('Contraseña válida:', esValido);

    if (!esValido) return null;

    const payload = { sub: usuario.id, correoElectronico: usuario.correoElectronico };
    return this.jwtService.sign(payload);
  }
}
