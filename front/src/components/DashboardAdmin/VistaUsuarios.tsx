'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { useAuth } from '@/app/context/AuthContext';
import EncabezadoUsuarios from './EncabezadoUsuarios';
import FiltrosUsuarios from './FiltrosUsuarios';
import TablaUsuarios from './TablaUsuarios';

interface Usuario {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario?: string;
  estadoCuenta?: string;
  estaConectado: boolean;
}

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'conectados' | 'desconectados'>('todos');
  const socket = useSocket();
  const { token, usuarioLogueado } = useAuth();

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      data.sort((a: Usuario, b: Usuario) => a.id - b.id);
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    if (token) fetchUsuarios();
  }, [token]);

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

  const cantidadTotal = usuarios.length;
  const cantidadConectados = usuarios.filter(u => u.estaConectado).length;
  const cantidadDesconectados = usuarios.filter(u => !u.estaConectado).length;

  const usuariosFiltrados = usuarios.filter((u) =>
    filtro === 'conectados' ? u.estaConectado : filtro === 'desconectados' ? !u.estaConectado : true
  );

  return (
    <div className="p-4 flex-1 overflow-auto">
      <EncabezadoUsuarios nombreUsuario={usuarioLogueado?.nombreCompleto || 'Usuario'} />
      <FiltrosUsuarios
        filtro={filtro}
        setFiltro={setFiltro}
        cantidadTotal={cantidadTotal}
        cantidadConectados={cantidadConectados}
        cantidadDesconectados={cantidadDesconectados}
      />
      <TablaUsuarios usuarios={usuariosFiltrados} />
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}
      </style>
    </div>
  );
}
