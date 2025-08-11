import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Usuario } from '../../entidades/usuario.entity';

// Define la interfaz del payload para asegurar los tipos correctos.
interface JwtPayload {
  sub?: number;
  id?: number;
  correoElectronico: string;
  esAdmin?: boolean; 
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
          // Primero intenta obtener el token de la cookie
          return request?.cookies?.jwt || null;
        },
        // Si no está en la cookie, intenta obtenerlo del header 'Bearer'
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
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
    
    // Devolvemos el objeto `usuario` completo, incluyendo la propiedad `esAdmin`.
    // Esto es crucial para que los guards posteriores, como RolesGuard, puedan acceder a ella.
    return usuario;
  }
}
