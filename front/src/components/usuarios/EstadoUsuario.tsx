'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';

interface Props {
  usuarioId: number;
}

interface EstadoActualizadoPayload {
  usuarioId: number;
  estaConectado: boolean;
}

export default function EstadoUsuario({ usuarioId }: Props) {
  const socket = useSocket();
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const actualizarEstado = (data: EstadoActualizadoPayload) => {
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
    <span className={conectado ? 'text-green-600' : 'text-gray-600'}>
      {conectado ? 'Conectado' : 'Desconectado'}
    </span>
  );
}
