import { Module } from '@nestjs/common';
import { SocketGateway } from '../../socket/socket.gateway';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [UsuariosModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
