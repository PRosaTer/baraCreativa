import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Usuario } from '../../entidades/usuario.entity';

// Define la interfaz del payload para asegurar los tipos correctos.
// 'sub' es el estándar, pero 'id' es una alternativa común.
interface JwtPayload {
  sub?: number;
  id?: number;
  correoElectronico: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService, // Inyectamos UsuariosService aquí
  ) {
    const jwtSecret = configService.get('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }
    super({
      // Extrae el token primero de la cookie y si no, de la cabecera
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
      passReqToCallback: false, // Esto es opcional, pero con la lógica anterior es mejor tenerlo en 'false'
    });
  }

  // El método validate se encarga de validar el payload del token y buscar al usuario.
  async validate(payload: JwtPayload): Promise<Usuario> {
    this.logger.log(`JwtStrategy: Validando payload: ${JSON.stringify(payload)}`);
    
    // Intenta obtener el ID del usuario de 'sub' o de 'id'.
    const userId = payload.sub || payload.id;

    if (typeof userId !== 'number') {
      this.logger.error('JwtStrategy: Error de validación: ID de usuario no numérico.');
      throw new UnauthorizedException('Token inválido: ID de usuario no numérico.');
    }

    const usuario = await this.usuariosService.encontrarPorId(userId);

    if (!usuario) {
      this.logger.warn('JwtStrategy: Error de validación: Usuario no encontrado.');
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }

    this.logger.log('JwtStrategy: Validación exitosa.');
    return usuario;
  }
}
