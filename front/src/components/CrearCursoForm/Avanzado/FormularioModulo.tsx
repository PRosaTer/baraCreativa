'use client';

import React from 'react';

interface ModuloForm {
  titulo: string;
  descripcion: string;
  videoFile?: File;
  pdfFile?: File;
}

interface Props {
  index: number;
  modulo: ModuloForm;
  handleModuloChange: (index: number, field: keyof ModuloForm, value: any) => void;
  eliminarModulo: (index: number) => void;
}

export default function FormularioModulo({ index, modulo, handleModuloChange, eliminarModulo }: Props) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-lg mb-2">Módulo {index + 1}</h4>
      <input
        type="text"
        value={modulo.titulo}
        onChange={(e) => handleModuloChange(index, 'titulo', e.target.value)}
        placeholder="Título del módulo"
        required
        className="w-full border p-2 rounded mb-2"
      />
      <textarea
        value={modulo.descripcion}
        onChange={(e) => handleModuloChange(index, 'descripcion', e.target.value)}
        placeholder="Descripción del módulo"
        required
        className="w-full border p-2 rounded mb-2"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Video:
        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            e.target.files && handleModuloChange(index, 'videoFile', e.target.files[0])
          }
          className="block mt-1"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        PDF:
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            e.target.files && handleModuloChange(index, 'pdfFile', e.target.files[0])
          }
          className="block mt-1"
        />
      </label>

      <button
        type="button"
        onClick={() => eliminarModulo(index)}
        className="mt-2 text-red-600 hover:text-red-800"
      >
        Eliminar módulo
      </button>
    </div>
  );
}
