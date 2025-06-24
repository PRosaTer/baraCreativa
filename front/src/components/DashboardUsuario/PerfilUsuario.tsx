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

  useEffect(() => {
    if (!fotoPerfil) return;
    const url = URL.createObjectURL(fotoPerfil);
    setPreviewFoto(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoPerfil]);

  const manejarCambioFoto = (file: File | null) => {
    setFotoPerfil(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center">Editar Perfil</h1>

      <SelectorFotoPerfil
        fotoPerfilInicial={previewFoto}
        editable={true}
        onFotoChange={manejarCambioFoto}
      />

      <div>
        <label className="block font-semibold" htmlFor="nombreCompleto">
          Nombre Completo:
        </label>
        <input
          id="nombreCompleto"
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block font-semibold" htmlFor="correoElectronico">
          Correo Electrónico:
        </label>
        <input
          id="correoElectronico"
          type="email"
          value={usuario.correoElectronico}
          disabled
          className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block font-semibold" htmlFor="telefono">
          Teléfono:
        </label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <strong>Tipo de Usuario:</strong> {usuario.tipoUsuario}
      </div>

      <div>
        <strong>Estado de Cuenta:</strong> {usuario.estadoCuenta}
      </div>

      <div>
        <strong>Última sesión:</strong>{' '}
        {usuario.ultimaSesion ? new Date(usuario.ultimaSesion).toLocaleString() : '-'}
      </div>

      <div>
        <strong>Administrador:</strong> {usuario.esAdmin ? 'Sí' : 'No'}
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={guardando}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
