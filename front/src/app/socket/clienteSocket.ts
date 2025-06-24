import { io } from 'socket.io-client';

let socket: any;

export const conectarSocket = (usuarioId: number) => {
  socket = io('http://localhost:3001', {
    query: { usuarioId },
  });

  return socket;
};

export const obtenerSocket = () => socket;
