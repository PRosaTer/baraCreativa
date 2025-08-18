import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (error: Error | null, success: boolean) => void) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://www.baracreativahn.com',
        'https://baracreativahn.com',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  },
})
export class UsuariosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(UsuariosGateway.name);
  @WebSocketServer()
  server: Server;
  private connectedUsers = new Map<number, string>();
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      this.logger.warn('Conexión rechazada: Token no proporcionado.');
      client.disconnect(true);
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub || payload.id;
      if (!userId || isNaN(Number(userId))) {
        this.logger.warn(`Conexión rechazada: ID de usuario inválido en el token. ID: ${userId}`);
        client.disconnect(true);
        return;
      }
      const userIdNum = Number(userId);
      const usuarioExistente = await this.usuariosService.findOne(userIdNum);
      if (!usuarioExistente) {
        this.logger.warn(`Conexión rechazada: Usuario con ID ${userIdNum} no encontrado.`);
        client.disconnect(true);
        return;
      }
      this.connectedUsers.set(userIdNum, client.id);
      await this.usuariosService.actualizarEstado(userIdNum, true);
      await this.usuariosService.actualizarUltimaSesion(userIdNum, new Date());
      this.logger.log(`✅ Usuario ${userIdNum} conectado.`);
      this.emitirListaUsuariosActualizada();
    } catch (error) {
      this.logger.error(`Error durante la conexión: ${error.message}`);
      client.disconnect(true);
    }
  }
  async handleDisconnect(client: Socket) {
    let disconnectedUserId: number | undefined;
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        disconnectedUserId = userId;
        this.connectedUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId !== undefined) {
      try {
        await this.usuariosService.actualizarEstado(disconnectedUserId, false);
        await this.usuariosService.actualizarUltimaSesion(disconnectedUserId, new Date());
        this.logger.log(`❌ Usuario ${disconnectedUserId} desconectado.`);
        this.emitirListaUsuariosActualizada();
      } catch (error) {
        this.logger.error(`Error al actualizar el estado de desconexión para el usuario ${disconnectedUserId}: ${error.message}`);
      }
    } else {
      this.logger.warn(`Cliente ${client.id} desconectado sin un ID de usuario registrado.`);
    }
  }
  @SubscribeMessage('getUsuarios')
  async handleGetUsuarios() {
    this.emitirListaUsuariosActualizada();
  }
  private async emitirListaUsuariosActualizada() {
    try {
      const usuarios = await this.usuariosService.findAll();
      this.server.emit('usuariosActualizados', usuarios);
    } catch (error) {
      this.logger.error(`Error al emitir la lista de usuarios actualizada: ${error.message}`);
    }
  }
}