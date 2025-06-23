'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Usuario {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: string;
  estadoCuenta: string;
  estaConectado: boolean;
}

let socket: Socket;

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const fetchUsuarios = () => {
    fetch('http://localhost:3001/auth/admin/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then(setUsuarios)
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsuarios();

    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuarioLocal.id) return;

    socket = io('http://localhost:3001', {
      query: { userId: usuarioLocal.id.toString() },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Conectado a socket.io');
    });

    socket.on('usuariosActualizados', (usuariosActualizados: Usuario[]) => {
      console.log('📦 WebSocket: usuarios actualizados', usuariosActualizados);
      setUsuarios(usuariosActualizados);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket desconectado');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 flex-1 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Conectado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center border-t">
              <td>{u.id}</td>
              <td>{u.nombreCompleto}</td>
              <td>{u.correoElectronico}</td>
              <td>{u.tipoUsuario}</td>
              <td>{u.estadoCuenta}</td>
              <td className={u.estaConectado ? 'text-green-600' : 'text-gray-400'}>
                {u.estaConectado ? '🟢 Conectado' : '⚪ Desconectado'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
