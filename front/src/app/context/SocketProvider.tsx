'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/app/context/AuthContext';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!usuario) return;

    const socketInstance: Socket = io('http://localhost:3001', {
      query: { usuarioId: usuario.id },
      transports: ['websocket'],
      withCredentials: true,
    });

    console.log('✅ WebSocket conectado como usuario', usuario.id);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [usuario]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
