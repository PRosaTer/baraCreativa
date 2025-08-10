import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const conectarSocket = (usuarioId: number): Socket => {
  // Usamos una variable de entorno para la URL de WebSocket
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
  socket = io(socketUrl, {
    query: { usuarioId },
    transports: ['websocket'],
    withCredentials: true,
  });

  return socket;
};

export const obtenerSocket = (): Socket | null => socket;
