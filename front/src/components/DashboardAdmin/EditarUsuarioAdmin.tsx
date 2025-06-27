'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Usuario } from '@/app/types/auth';

interface Props {
  usuario: Usuario;
  onCerrar: () => void;
  onActualizar: (actualizado: Usuario) => void;
}

export default function EditarUsuarioAdmin({ usuario, onCerrar, onActualizar }: Props) {
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [tipoUsuario, setTipoUsuario] = useState<Usuario['tipoUsuario']>(usuario.tipoUsuario);
  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [guardando, setGuardando] = useState(false);


  const telefonoRef = useRef<HTMLInputElement>(null);

  const urlFotoPerfil = usuario.fotoPerfil
    ? `http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}`
    : null;

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${usuario.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefono, tipoUsuario, nombreCompleto }),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      const actualizado: Usuario = await res.json();
      onActualizar(actualizado);
      onCerrar();
    } catch (error) {
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCerrar]);


  const handleKeyDownNombre = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      telefonoRef.current?.focus();
    }
  };

  const handleKeyDownTelefono = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGuardar();
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800">Editar Usuario</h2>

      <div className="flex justify-center">
        {urlFotoPerfil ? (
          <img
            src={urlFotoPerfil}
            alt={`Foto de perfil de ${usuario.nombreCompleto}`}
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sin foto
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Nombre Completo:</label>
        <input
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          onKeyDown={handleKeyDownNombre}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
        />

        <label className="block text-gray-700 font-medium">Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          onKeyDown={handleKeyDownTelefono}
          ref={telefonoRef}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
        />

        <label className="block text-gray-700 font-medium">Tipo de Usuario:</label>
        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value as Usuario['tipoUsuario'])}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
        >
          <option value="Alumno">Alumno</option>
          <option value="Instructor">Instructor</option>
          <option value="Empresa">Empresa</option>
          <option value="Admin">Admin</option>
        </select>

        <label className="block text-gray-700 font-medium">Correo Electrónico:</label>
        <input
          type="email"
          value={usuario.correoElectronico}
          readOnly
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          onClick={onCerrar}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
