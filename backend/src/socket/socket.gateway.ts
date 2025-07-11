import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly usuariosService: UsuariosService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);


    const userId = Number(client.handshake.query.userId);
    if (userId) {
      await this.usuariosService.actualizarEstado(userId, true);
      const usuarios = await this.usuariosService.findAll();
      this.server.emit('usuariosActualizados', usuarios);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);

    const userId = Number(client.handshake.query.userId);
    if (userId) {
      await this.usuariosService.actualizarEstado(userId, false);
      const usuarios = await this.usuariosService.findAll();
      this.server.emit('usuariosActualizados', usuarios);
    }
  }
}
