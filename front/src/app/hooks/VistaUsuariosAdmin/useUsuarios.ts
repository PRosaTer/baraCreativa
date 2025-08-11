'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { Usuario } from '@/app/types/auth';

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const socket = useSocket();

  const fetchUsuarios = async () => {
    try {
      // Se ha corregido la URL para que apunte al endpoint general de usuarios.
      // El backend ahora discriminará si el usuario es un admin o no.
      const res = await fetch(`/api/usuarios`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error(await res.text());

      const data: Usuario[] = await res.json();
      data.sort((a, b) => a.id - b.id);
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const actualizar = (usuariosActualizados: Usuario[]) => {
      usuariosActualizados.sort((a, b) => a.id - b.id);
      setUsuarios(usuariosActualizados);
    };

    socket.on('usuariosActualizados', actualizar);
    return () => {
      socket.off('usuariosActualizados', actualizar);
    };
  }, [socket]);

  const actualizarUsuarioEnLista = (actualizado: Usuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
  };

  return {
    usuarios,
    actualizarUsuarioEnLista,
    fetchUsuarios,
  };
}
