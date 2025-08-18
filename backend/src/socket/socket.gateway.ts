import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => UsuariosService))
    private readonly usuariosService: UsuariosService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);

    const userId = Number(client.handshake.query.userId);

    if (userId) {
      await this.usuariosService.actualizarEstado(userId, true);
      await this.usuariosService.notificarActualizacionEstado();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);

    const userId = Number(client.handshake.query.userId);

    if (userId) {
      await this.usuariosService.actualizarEstado(userId, false);
      await this.usuariosService.notificarActualizacionEstado();
    }
  }
}
