import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    // Obtener las URLs de origen permitidas desde las variables de entorno
    // Se usa una cadena de texto para facilitar la configuración en el archivo .env
    origin: (origin: string, callback: (error: Error | null, success: boolean) => void) => {
      // Usamos la variable de entorno para la URL del frontend
      const allowedOrigins = [
        'http://localhost:3000', // Mantener para desarrollo local
        'https://bara-creativa-front.onrender.com', // Ejemplo de URL de producción
        'https://baracreativa.onrender.com' // Otro ejemplo de URL de producción
      ];

      // Podríamos obtener esto de ConfigService, pero para CORS en un decorador,
      // es más sencillo gestionarlo de forma dinámica si es necesario.
      // Aquí, la configuración está en el constructor.
      // Si el origen está en la lista de permitidos o es un origen no-HTTP (como 'null' para conexiones del mismo origen)
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
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, Socket>();

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService, // Inyectamos ConfigService
  ) {
    // Es mejor usar ConfigService aquí si la lista de orígenes es dinámica.
    // Para simplificar, la he dejado fija en el decorador, pero es importante tener en cuenta que
    // las variables de entorno pueden ser la mejor opción.
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (frontendUrl) {
      // Nota: NestJS no soporta `ConfigService` directamente en los decoradores,
      // por lo que he mantenido la lista en el decorador con un valor fijo.
      // Para una implementación más dinámica, se podría usar un middleware.
      // He añadido un comentario para explicar esto en el código.
    }
  }

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
