import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://bara-creativa-front.onrender.com',
      'https://baracreativa.onrender.com/', // Añadimos la URL de producción para CORS
    ],
    credentials: true,
  },
})
export class UsuariosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, Socket>();

  constructor(private readonly usuariosService: UsuariosService) {}

  async handleConnection(client: Socket) {
    const userIdStr = client.handshake.query.usuarioId as string;
    const userId = parseInt(userIdStr);

    if (!userId || isNaN(userId)) {
      client.disconnect();
      return;
    }

    this.connectedUsers.set(userId, client);

    await this.usuariosService.actualizarEstado(userId, true);

    const usuarios = await this.usuariosService.findAll();
    this.server.emit('usuariosActualizados', usuarios);

    console.log(`✅ Usuario ${userId} conectado.`);
  }

  async handleDisconnect(client: Socket) {
    let disconnectedUserId: number | undefined;

    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        disconnectedUserId = userId;
        this.connectedUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId !== undefined) {
      await this.usuariosService.actualizarEstado(disconnectedUserId, false);

      const usuarios = await this.usuariosService.findAll();
      this.server.emit('usuariosActualizados', usuarios);

      console.log(`❌ Usuario ${disconnectedUserId} desconectado.`);
    }
  }
}
