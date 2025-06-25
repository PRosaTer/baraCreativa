'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Usuario } from '@/app/types/auth';
import SelectorFotoPerfil from '@/components/ui/SelectorFotoPerfil';

interface Props {
  usuario: Usuario;
  onActualizar: (usuarioActualizado: Usuario) => void;
}

export default function PerfilUsuarioEditable({ usuario, onActualizar }: Props) {
  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState(
    usuario.fotoPerfil ? `http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}` : undefined
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);


  const [estadoInicial, setEstadoInicial] = useState({
    telefono: usuario.telefono || '',
    fotoPerfilUrl: usuario.fotoPerfil ? `http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}` : undefined,
  });

  useEffect(() => {
    if (!fotoPerfil) return;
    const url = URL.createObjectURL(fotoPerfil);
    setPreviewFoto(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoPerfil]);

  const manejarCambioFoto = (file: File | null) => {
    if (editando) setFotoPerfil(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!editando) {
      setEstadoInicial({ telefono, fotoPerfilUrl: previewFoto });
      setEditando(true);
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('nombreCompleto', nombreCompleto);
      formData.append('telefono', telefono);
      if (fotoPerfil) formData.append('fotoPerfil', fotoPerfil);

      const res = await fetch(`http://localhost:3001/usuarios/${usuario.id}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al actualizar');
      }

      const usuarioActualizado = await res.json();
      onActualizar(usuarioActualizado);
      alert('Perfil actualizado con éxito');
      setEditando(false);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setTelefono(estadoInicial.telefono);
    setFotoPerfil(null);
    setPreviewFoto(estadoInicial.fotoPerfilUrl);
    setEditando(false);
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900
                 rounded-2xl shadow-2xl shadow-yellow-400/30
                 ring-1 ring-yellow-400/20
                 space-y-6 font-sans text-white select-none"
    >
      <h1 className="text-3xl font-extrabold text-center tracking-wide mb-4 drop-shadow-[0_0_10px_rgba(255,255,200,0.7)]">
        Bienvenido, {usuario.nombreCompleto}
      </h1>

      <SelectorFotoPerfil
        fotoPerfilInicial={previewFoto}
        editable={editando}
        onFotoChange={manejarCambioFoto}
      />

      <div className="relative z-0 w-full group">
        <input
          id="nombreCompleto"
          type="text"
          value={nombreCompleto}
          disabled
          className="block py-2.5 px-0 w-full text-white bg-transparent border-0 border-b-2 border-gray-600
                     appearance-none focus:outline-none focus:ring-0 focus:border-yellow-400
                     peer cursor-not-allowed"
          placeholder=" "
        />
        <label
          htmlFor="nombreCompleto"
          className="absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                     peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-yellow-400"
        >
          Nombre Completo
        </label>
      </div>

      <div className="relative z-0 w-full group">
        <input
          id="correoElectronico"
          type="email"
          value={usuario.correoElectronico}
          disabled
          className="block py-2.5 px-0 w-full text-white bg-transparent border-0 border-b-2 border-gray-600
                     appearance-none focus:outline-none focus:ring-0 focus:border-yellow-400
                     peer cursor-not-allowed"
          placeholder=" "
        />
        <label
          htmlFor="correoElectronico"
          className="absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                     peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-yellow-400"
        >
          Correo Electrónico
        </label>
      </div>

      <div className="relative z-0 w-full group">
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          disabled={!editando}
          className={`block py-2.5 px-0 w-full text-white bg-transparent border-0 border-b-2
                     appearance-none focus:outline-none focus:ring-0 focus:border-yellow-400
                     peer
                     ${!editando ? 'border-gray-600 cursor-not-allowed' : 'border-yellow-400'}`}
          placeholder=" "
        />
        <label
          htmlFor="telefono"
          className="absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                     peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
                     peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-yellow-400"
        >
          Teléfono
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 text-yellow-400 font-semibold tracking-wide select-text">
        <p>
          <span className="opacity-80">Tipo de Usuario:</span> {usuario.tipoUsuario}
        </p>
        <p>
          <span className="opacity-80">Estado de Cuenta:</span> {usuario.estadoCuenta}
        </p>
        <p>
          <span className="opacity-80">Última sesión:</span>{' '}
          {usuario.ultimaSesion ? new Date(usuario.ultimaSesion).toLocaleString() : '-'}
        </p>
        <p>
          <span className="opacity-80">Administrador:</span> {usuario.esAdmin ? 'Sí' : 'No'}
        </p>
      </div>

      {error && <div className="text-red-500 font-semibold">{error}</div>}

      <div className="flex justify-center space-x-4 mt-4">
        {editando && (
          <button
            type="button"
            onClick={cancelarEdicion}
            disabled={guardando}
            className="px-6 py-2 rounded-3xl font-semibold bg-gray-700 hover:bg-gray-600 text-yellow-400 transition"
          >
            Cancelar
          </button>
        )}

        <button
          type="submit"
          disabled={guardando}
          className={`
            relative inline-block px-8 py-3 font-extrabold tracking-wide text-black rounded-3xl
            bg-gradient-to-r from-red-500 to-yellow-400
            shadow-lg shadow-yellow-400/70
            transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110
            hover:bg-gradient-to-r hover:from-yellow-400 hover:to-red-500
            disabled:opacity-60 disabled:cursor-not-allowed
            overflow-visible
            select-none
            ring-2 ring-yellow-400
            focus-visible:ring-yellow-300 focus-visible:outline-none
          `}
        >
          <span className="relative z-10 flex items-center justify-center">
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Editar'}
          </span>

          <span className="absolute border-dot"></span>
        </button>
      </div>
    </form>
  );
}
