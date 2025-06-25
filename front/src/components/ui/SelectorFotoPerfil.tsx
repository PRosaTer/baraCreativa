'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  fotoPerfilInicial?: string;
  editable?: boolean;
  onFotoChange?: (file: File | null) => void;
}

export default function SelectorFotoPerfil({
  fotoPerfilInicial,
  editable = true,
  onFotoChange,
}: Props) {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fotoPerfilInicial) {
      setPreview(fotoPerfilInicial);
    } else {
      setPreview(undefined);
    }
  }, [fotoPerfilInicial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPreview(file ? URL.createObjectURL(file) : undefined);

    if (onFotoChange) {
      onFotoChange(file);
    }
  };

  const triggerFileSelect = () => {
    if (editable && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <div className="relative w-24 h-24 mx-auto">
      {preview ? (
        <img
          src={preview}
          alt="Foto de Perfil"
          className="w-24 h-24 object-cover rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,255,150,0.7)]"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,255,150,0.7)]">
          Sin foto
        </div>
      )}

      {editable && (
        <>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileSelect}
            className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-1 shadow-lg
                       flex items-center justify-center text-xs font-semibold select-none
                       transition-colors duration-200"
            title="Cambiar foto"
          >
            ✎
          </button>
        </>
      )}
    </div>
  );
}
