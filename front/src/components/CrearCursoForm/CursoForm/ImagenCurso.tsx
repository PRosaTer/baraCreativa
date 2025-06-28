"use client";

import React from 'react';

interface Props {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagenPreview: string | null;
}

export default function ImagenCurso({ handleFileChange, imagenPreview }: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">Imagen del Curso</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagenPreview && <img src={imagenPreview} alt="Preview imagen curso" className="mt-2 max-h-48 rounded" />}
    </div>
  );
}
