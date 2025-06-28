'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  imagenCurso: File | null;
  setImagenCurso: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function FormularioImagenCurso({ imagenCurso, setImagenCurso }: Props) {
  const handleImagenChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenCurso(e.target.files[0]);
    }
  };

  return (
    <div>
      <label htmlFor="imagenCurso" className="block text-lg font-medium text-gray-700 mb-2">
        Imagen del Curso:
      </label>
      <input
        type="file"
        id="imagenCurso"
        accept="image/*"
        onChange={handleImagenChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {imagenCurso && (
        <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {imagenCurso.name}</p>
      )}
    </div>
  );
}
