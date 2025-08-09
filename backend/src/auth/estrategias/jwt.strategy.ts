import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
    const jwtSecret = configService.get('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          this.logger.log('JwtStrategy: Intentando extraer token de la cookie...');
          const token = request?.cookies?.jwt || null;
          if (token) {
            this.logger.log('JwtStrategy: Token encontrado en la cookie.');
          } else {
            this.logger.warn('JwtStrategy: Token NO encontrado en la cookie.');
          }
          return token;
        },
      ]),
      secretOrKey: jwtSecret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    this.logger.log(`JwtStrategy: Validando payload: ${JSON.stringify(payload)}`);
    if (typeof payload.sub !== 'number' || isNaN(payload.sub)) {
      this.logger.error('JwtStrategy: Error de validación: ID de usuario no numérico.');
      throw new UnauthorizedException('Token inválido: ID de usuario no numérico.');
    }
    const usuario = await this.usuariosService.encontrarPorId(payload.sub);
    if (!usuario) {
      this.logger.warn('JwtStrategy: Error de validación: Usuario no encontrado.');
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }
    this.logger.log('JwtStrategy: Validación exitosa.');
    return usuario;
  }
}
