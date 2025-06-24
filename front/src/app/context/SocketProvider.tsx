'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.id) {
      console.warn('⚠️ Usuario no encontrado en localStorage');
      return;
    }

    setUsuarioId(usuario.id);

    const socket = io('http://localhost:3001', {
      query: { userId: usuario.id.toString() },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log(`✅ WebSocket conectado como usuario ${usuario.id}`);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      console.log('🔌 WebSocket cerrado desde frontend');
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
