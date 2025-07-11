import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Request } from 'express';
import { Usuario } from '../../entidades/usuario.entity';

interface JwtPayload {
  sub: number;
  correoElectronico: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          this.logger.debug(`Intentando extraer JWT de cookies. Cookies: ${JSON.stringify(request?.cookies)}`);
          return request?.cookies?.jwt || null;
        },
      ]),
      secretOrKey: jwtSecret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    this.logger.log(`[validate] Payload recibido: ${JSON.stringify(payload)}`);

    if (typeof payload.sub !== 'number' || isNaN(payload.sub)) {
      this.logger.error(`[validate] Token inválido: ID de usuario no numérico o NaN. Valor: ${payload.sub}`);
      throw new UnauthorizedException('Token inválido: ID de usuario no numérico.');
    }

    const usuario = await this.usuariosService.encontrarPorId(payload.sub);

    if (!usuario) {
      this.logger.error(`[validate] Usuario con ID ${payload.sub} no encontrado.`);
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }

    return usuario;
  }
}
