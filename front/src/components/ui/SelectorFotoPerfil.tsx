'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  fotoPerfilInicial?: string;
  onFotoSeleccionada?: (file: File) => void;
  editable?: boolean; 
}

export default function SelectorFotoPerfil({
  fotoPerfilInicial,
  onFotoSeleccionada,
  editable = true,
}: Props) {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (fotoPerfilInicial) {
      setPreview(fotoPerfilInicial);
    } else {
      setPreview(undefined);
    }
  }, [fotoPerfilInicial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    if (onFotoSeleccionada) {
      onFotoSeleccionada(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {preview ? (
        <img
          src={preview}
          alt="Foto de Perfil"
          className="w-24 h-24 object-cover rounded-full border"
          style={{ width: 'auto', height: '96px' }}
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
          Sin foto
        </div>
      )}

      {editable && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2"
        />
      )}
    </div>
  );
}
