'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { Usuario } from '@/app/types/auth';


export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';


  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/admin/users`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error(await res.text());

      const data: Usuario[] = await res.json();
      data.sort((a, b) => a.id - b.id);
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);


  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);


  useEffect(() => {
    if (!socket) return;


    const handleUsuariosActualizados = (updatedUsers: Usuario[]) => {
      setUsuarios(updatedUsers);
    };


    socket.on('usuariosActualizados', handleUsuariosActualizados);


    socket.emit('getUsuarios');


    return () => {
      socket.off('usuariosActualizados', handleUsuariosActualizados);
    };
  }, [socket]); 


  const actualizarUsuarioEnLista = useCallback((actualizado: Usuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
  }, []);

  return {
    usuarios,
    loading,
    actualizarUsuarioEnLista,
    fetchUsuarios,
  };
}
