"use client";

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { Usuario } from '@/app/types/auth'; 

interface Props {
  usuarioId: number;
}

export default function EstadoUsuario({ usuarioId }: Props) {
  const socket = useSocket();
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    if (!socket) {
        console.warn('Socket no disponible en EstadoUsuario.');
        return;
    }

   
    const actualizarEstado = (usuarios: Usuario[]) => {
      const usuarioActualizado = usuarios.find(u => u.id === usuarioId);
      

      if (usuarioActualizado) {
        setConectado(usuarioActualizado.estaConectado);
      }
    };


    socket.on('usuariosActualizados', actualizarEstado);


    if (socket.connected) {
        socket.emit('getUsuarios');
    }

    return () => {
      socket.off('usuariosActualizados', actualizarEstado);
    };
    
  }, [usuarioId, socket]);

  return (
    <span className={conectado ? 'text-green-600' : 'text-gray-600'}>
      {conectado ? 'Conectado' : 'Desconectado'}
    </span>
  );
}
