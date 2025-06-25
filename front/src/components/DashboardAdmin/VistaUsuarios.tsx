'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/app/context/SocketProvider';
import { useAuth } from '@/app/context/AuthContext';

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      data.sort((a: Usuario, b: Usuario) => a.id - b.id);
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleUsuariosActualizados = (usuariosActualizados: Usuario[]) => {
      usuariosActualizados.sort((a, b) => a.id - b.id);
      setUsuarios(usuariosActualizados);
    };

    socket.on('usuariosActualizados', handleUsuariosActualizados);

    return () => {
      socket.off('usuariosActualizados', handleUsuariosActualizados);
    };
  }, [socket]);

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtro === 'conectados') return u.estaConectado;
    if (filtro === 'desconectados') return !u.estaConectado;
    return true;
  });

  return (
    <div className="p-4 flex-1 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Usuarios Registrados</h2>

        <div
          className="text-xl font-semibold bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent select-none"
          style={{
            backgroundSize: '200% auto',
            animation: 'gradientShift 3s linear infinite',
          }}
        >
          Buenas, {usuarioLogueado?.nombreCompleto || 'Usuario'}
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-1 rounded font-semibold transition ${
            filtro === 'todos'
              ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-red-200'
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro('conectados')}
          className={`px-4 py-1 rounded font-semibold transition ${
            filtro === 'conectados'
              ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-red-200'
          }`}
        >
          Conectados
        </button>

        <button
          onClick={() => setFiltro('desconectados')}
          className={`px-4 py-1 rounded font-semibold transition ${
            filtro === 'desconectados'
              ? 'bg-black text-red-400 ring-2 ring-red-400 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-red-200'
          }`}
        >
          Desconectados
        </button>
      </div>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="p-2 border-r border-gray-300">ID</th>
            <th className="p-2 border-r border-gray-300">Nombre</th>
            <th className="p-2 border-r border-gray-300">Email</th>
            <th className="p-2 border-r border-gray-300">Tipo</th>
            <th className="p-2 border-r border-gray-300">Estado</th>
            <th className="p-2">Conectado</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id} className="text-center border-t border-gray-300">
              <td className="p-2 border-r border-gray-300">{u.id}</td>
              <td className="p-2 border-r border-gray-300">{u.nombreCompleto}</td>
              <td className="p-2 border-r border-gray-300">{u.correoElectronico}</td>
              <td className="p-2 border-r border-gray-300">{u.tipoUsuario || '-'}</td>
              <td className="p-2 border-r border-gray-300">{u.estadoCuenta || '-'}</td>
              <td className={`p-2 ${u.estaConectado ? 'text-green-600' : 'text-gray-400'}`}>
                {u.estaConectado ? '🟢 Conectado' : '⚪ Desconectado'}
              </td>
            </tr>
          ))}
          {usuariosFiltrados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No hay usuarios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>
        {`
          @keyframes gradientShift {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }
        `}
      </style>
    </div>
  );
}
