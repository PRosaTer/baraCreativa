"use client";

import React from 'react';

interface Props {
  nombre: string;
  fotoPerfil?: string | null;
}

export default function FotoPerfilUsuario({ nombre, fotoPerfil }: Props) {
  const url = fotoPerfil ? `http://localhost:3001/uploads/perfiles/${fotoPerfil}` : null;

  return (
    <div className="flex justify-center">
      {url ? (
        <img
          src={url}
          alt={`Foto de perfil de ${nombre}`}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          Sin foto
        </div>
      )}
    </div>
  );
}
