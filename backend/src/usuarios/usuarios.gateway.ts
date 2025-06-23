import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsuariosService } from './usuarios.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class UsuariosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usuariosConectados = new Map<string, number>();
  private logger = new Logger('UsuariosGateway');

  constructor(private readonly usuariosService: UsuariosService) {}

  async handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    this.logger.log(`📡 Nueva conexión de userId: ${userId} (socket.id: ${client.id})`);

    if (!userId) {
      this.logger.warn('❌ Conexión rechazada: userId faltante');
      client.disconnect();
      return;
    }

    this.usuariosConectados.set(client.id, userId);
    await this.usuariosService.update(userId, { estaConectado: true });

    const usuarios = await this.usuariosService.findAll();
    this.server.emit('usuariosActualizados', usuarios);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.usuariosConectados.get(client.id);
    this.logger.log(`🔌 Desconexión de socket.id: ${client.id} (userId: ${userId})`);

    if (userId) {
      this.logger.log(`⚠️ Usuario ${userId} desconectado, marcando estaConectado = false`);
      await this.usuariosService.update(userId, { estaConectado: false });
      this.usuariosConectados.delete(client.id);

      const usuarios = await this.usuariosService.findAll();
      this.server.emit('usuariosActualizados', usuarios);
    }
  }
}
