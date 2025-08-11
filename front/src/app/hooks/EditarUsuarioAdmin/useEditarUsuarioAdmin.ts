"use client";

import { useState, useEffect, useRef } from 'react';
import { Usuario } from '@/app/types/auth';

export default function useEditarUsuarioAdmin(
  usuario: Usuario,
  onActualizar: (actualizado: Usuario) => void,
  onCerrar: () => void
) {
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [tipoUsuario, setTipoUsuario] = useState<Usuario['tipoUsuario']>(usuario.tipoUsuario);
  const [nombreCompleto, setNombreCompleto] = useState(usuario.nombreCompleto);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const telefonoRef = useRef<HTMLInputElement>(null);

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${usuario.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono, tipoUsuario, nombreCompleto }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Error al actualizar');
      }

      const actualizado: Usuario = await res.json();
      onActualizar(actualizado);
      onCerrar();
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Error inesperado');
      console.error(e);
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

  return {
    telefono,
    tipoUsuario,
    nombreCompleto,
    guardando,
    error,
    telefonoRef,
    setTelefono,
    setTipoUsuario,
    setNombreCompleto,
    handleGuardar,
    handleKeyDownNombre,
    handleKeyDownTelefono,
  };
}
