import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuarios.service';

interface JwtPayload {
  sub: number;
  correoElectronico: string;
}

interface UserFromJwtValidation {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono?: string;
  tipoUsuario?: string;
  nombreEmpresa?: string;
  fotoPerfil?: string;
  estadoCuenta?: string;
  esAdmin: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  ultimaSesion?: Date;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: false,
    };

    super(options);
  }

  async validate(payload: JwtPayload): Promise<UserFromJwtValidation> {
    const usuario = await this.usuariosService.encontrarPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }

    return {
      id: usuario.id,
      nombreCompleto: usuario.nombreCompleto,
      correoElectronico: usuario.correoElectronico,
      telefono: usuario.telefono,
      tipoUsuario: usuario.tipoUsuario,
      nombreEmpresa: usuario.nombreEmpresa,
      fotoPerfil: usuario.fotoPerfil,
      estadoCuenta: usuario.estadoCuenta,
      esAdmin: usuario.esAdmin,
      creadoEn: usuario.creadoEn,
      actualizadoEn: usuario.actualizadoEn,
      ultimaSesion: usuario.ultimaSesion,
    };
  }
}
