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
  const socket = useSocket();
  const { token } = useAuth();

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
      setUsuarios(usuariosActualizados);
    };

    socket.on('usuariosActualizados', handleUsuariosActualizados);

    return () => {
      socket.off('usuariosActualizados', handleUsuariosActualizados);
    };
  }, [socket]);

  return (
    <div className="p-4 flex-1 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
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
          {usuarios.map((u) => (
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
        </tbody>
      </table>
    </div>
  );
}
