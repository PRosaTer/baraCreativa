'use client';

import React, { useRef } from "react";

interface Props {
  fotoPerfilInicial?: string;
  editable: boolean;
  onFotoChange: (file: File | null) => void;
}

export default function SelectorFotoPerfilEditable({
  fotoPerfilInicial,
  editable,
  onFotoChange,
}: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleClickImagen = () => {
    if (editable) inputFileRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) return;
    const file = e.target.files ? e.target.files[0] : null;
    onFotoChange(file);
  };

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept="image/*"
        ref={inputFileRef}
        className="hidden"
        onChange={handleChangeFile}
      />
      {fotoPerfilInicial ? (
        <img
          src={fotoPerfilInicial}
          alt="Foto de perfil"
          onClick={handleClickImagen}
          className={`w-28 h-28 rounded-full object-cover cursor-${editable ? "pointer" : "default"}`}
          title={editable ? "Click para cambiar foto" : undefined}
        />
      ) : (
        <div
          onClick={handleClickImagen}
          className={`w-28 h-28 rounded-full bg-gray-500 flex items-center justify-center text-white cursor-${editable ? "pointer" : "default"}`}
          title={editable ? "Click para agregar foto" : undefined}
        >
          Sin foto
        </div>
      )}
    </div>
  );
}
