import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // Este método se activa para determinar si la ruta puede ser activada.
  // La lógica de Passport se encarga de la validación del token.
  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard: canActivate se ha llamado.');
    const request = context.switchToHttp().getRequest();
    this.logger.log(`JwtAuthGuard: Cookies en la petición: ${JSON.stringify(request.cookies)}`);

    // Llama al método canActivate de la clase padre (AuthGuard)
    // para ejecutar la estrategia 'jwt'.
    return super.canActivate(context);
  }
}
