import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

// Define la clave de metadatos para los roles.
export const ROLES_KEY = 'roles';

// Decorador para establecer los roles permitidos en una ruta.
// Se usará así: @Roles('admin')
export const Roles = (...roles: string[]) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Obtener los roles requeridos de los metadatos de la ruta.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Para métodos del controlador
      context.getClass(), // Para el controlador completo
    ]);

    // Si no hay roles requeridos, permite el acceso.
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario del objeto de la solicitud.
    // El 'user' es agregado a la solicitud por el JwtStrategy.
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { role: string }; // Asume que el usuario tiene una propiedad 'role'.

    // Si no hay usuario o no tiene un rol, deniega el acceso.
    if (!user || !user.role) {
      this.logger.warn(
        'RolesGuard: Intento de acceso a ruta protegida sin usuario o rol.',
      );
      throw new UnauthorizedException('Acceso denegado. Rol de usuario no definido.');
    }

    // 3. Verificar si el rol del usuario está incluido en los roles requeridos.
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      this.logger.warn(
        `RolesGuard: Usuario con rol '${user.role}' intentó acceder a ruta para roles: ${requiredRoles.join(', ')}`,
      );
      throw new UnauthorizedException('No tienes los permisos necesarios para esta acción.');
    }

    this.logger.log('RolesGuard: Acceso permitido.');
    return true;
  }
}
