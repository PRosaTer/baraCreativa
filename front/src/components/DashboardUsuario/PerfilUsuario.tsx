'use client';

import React from 'react';
import { Usuario } from '@/app/types/auth';
import SelectorFotoPerfil from '@/components/ui/SelectorFotoPerfil';

interface Props {
  usuario: Usuario;
}

export default function PerfilUsuario({ usuario }: Props) {
  const urlFotoPerfil = usuario.fotoPerfil
    ? `http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}`
    : undefined;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Bienvenido {usuario.nombreCompleto}
      </h1>

      <SelectorFotoPerfil fotoPerfilInicial={urlFotoPerfil} editable={false} />

      <div>
        <strong>Nombre Completo:</strong> {usuario.nombreCompleto}
      </div>
      <div>
        <strong>Correo Electrónico:</strong> {usuario.correoElectronico}
      </div>

      {usuario.telefono && (
        <div>
          <strong>Teléfono:</strong> {usuario.telefono}
        </div>
      )}

      <div>
        <strong>Tipo de Usuario:</strong> {usuario.tipoUsuario}
      </div>

      <div>
        <strong>Estado de Cuenta:</strong> {usuario.estadoCuenta}
      </div>

      {usuario.ultimaSesion && (
        <div>
          <strong>Última sesión:</strong>{' '}
          {new Date(usuario.ultimaSesion).toLocaleString()}
        </div>
      )}

      <div>
        <strong>Administrador:</strong> {usuario.esAdmin ? 'Sí' : 'No'}
      </div>
    </div>
  );
}
