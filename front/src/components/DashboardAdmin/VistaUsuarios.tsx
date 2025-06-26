'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { useAuth } from '@/app/context/AuthContext';
import EncabezadoUsuarios from './EncabezadoUsuarios';
import FiltrosUsuarios from './FiltrosUsuarios';
import TablaUsuarios from './TablaUsuarios';
import BarraBusquedaUsuarios from './BarraBusquedaUsuarios';
import EditarUsuarioAdmin from './EditarUsuarioAdmin';
import { Usuario } from '@/app/types/auth';

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'conectados' | 'desconectados'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const socket = useSocket();
  const { usuario } = useAuth();

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/users`, {
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

  const cantidadTotal = usuarios.length;
  const cantidadConectados = usuarios.filter((u) => u.estaConectado).length;
  const cantidadDesconectados = usuarios.filter((u) => !u.estaConectado).length;

  const usuariosFiltrados = usuarios
    .filter((u) =>
      filtro === 'conectados' ? u.estaConectado : filtro === 'desconectados' ? !u.estaConectado : true
    )
    .filter(
      (u) =>
        u.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.correoElectronico.toLowerCase().includes(busqueda.toLowerCase())
    );

  const cerrarEditor = () => {
    setUsuarioEditando(null);
  };

  const actualizarUsuarioEnLista = (actualizado: Usuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
  };

  return (
    <div className="p-4 flex-1 overflow-auto">
      <EncabezadoUsuarios nombreUsuario={usuario?.nombreCompleto || 'Usuario'} />

      <div className="flex flex-wrap items-center justify-between gap-4 my-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FiltrosUsuarios
            filtro={filtro}
            setFiltro={setFiltro}
            cantidadTotal={cantidadTotal}
            cantidadConectados={cantidadConectados}
            cantidadDesconectados={cantidadDesconectados}
          />
          <div className="w-60">
            <BarraBusquedaUsuarios valor={busqueda} onCambio={setBusqueda} />
          </div>
        </div>
      </div>

      <TablaUsuarios usuarios={usuariosFiltrados} onEditar={setUsuarioEditando} />

      {usuarioEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
            <EditarUsuarioAdmin
              usuario={usuarioEditando}
              onCerrar={cerrarEditor}
              onActualizar={actualizarUsuarioEnLista}
            />
          </div>
        </div>
      )}

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
