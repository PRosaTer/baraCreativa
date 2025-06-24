'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';

interface Props {
  usuarioId: number;
  inicial: boolean;
}

export default function EstadoUsuario({ usuarioId, inicial }: Props) {
  const [conectado, setConectado] = useState(inicial);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const actualizarEstado = (data: any) => {
      if (data.usuarioId === usuarioId) {
        setConectado(data.estaConectado);
      }
    };

    socket.on('estadoActualizado', actualizarEstado);
    return () => {
      socket.off('estadoActualizado', actualizarEstado);
    };
  }, [usuarioId, socket]);

  return (
    <span
      className={`px-2 py-1 rounded text-white text-sm ${
        conectado ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {conectado ? 'Conectado' : 'Desconectado'}
    </span>
  );
}
