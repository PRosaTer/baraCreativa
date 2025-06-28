'use client';

import React from 'react';

interface Props {
  index: number;
  titulo: string;
  descripcion: string;
  onTituloChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onEliminar: () => void;
}

export default function ModuloItem({
  index,
  titulo,
  descripcion,
  onTituloChange,
  onDescripcionChange,
  onEliminar,
}: Props) {
  return (
    <div className="mb-4 p-4 border rounded bg-gray-50 relative">
      <label className="block mb-1 font-medium">Título Módulo {index + 1}</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => onTituloChange(e.target.value)}
        required
        className="w-full border rounded px-3 py-2 mb-2"
      />
      <label className="block mb-1 font-medium">Descripción Módulo {index + 1}</label>
      <textarea
        value={descripcion}
        onChange={(e) => onDescripcionChange(e.target.value)}
        required
        rows={2}
        className="w-full border rounded px-3 py-2"
      />
      <button
        type="button"
        onClick={onEliminar}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
        title="Eliminar módulo"
      >
        &times;
      </button>
    </div>
  );
}
