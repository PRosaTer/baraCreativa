import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard: canActivate se ha llamado.');
    const request = context.switchToHttp().getRequest();
    this.logger.log(`JwtAuthGuard: Cookies en la petición: ${JSON.stringify(request.cookies)}`);
    return super.canActivate(context);
  }
}
