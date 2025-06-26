import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const conectarSocket = (usuarioId: number): Socket => {
  socket = io('http://localhost:3001', {
    query: { usuarioId },
    transports: ['websocket'],
    withCredentials: true,
  });

  return socket;
};

export const obtenerSocket = (): Socket | null => socket;
