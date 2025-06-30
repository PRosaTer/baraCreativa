import React from 'react';
import { Modulo } from '@/app/types/curso';

interface Props {
  modulos: Modulo[];
  onAgregar: () => void;
  onModificar: (index: number, campo: keyof Modulo, valor: string) => void;
  onEliminar: (index: number) => void;
}

export default function ListaModulos({ modulos, onAgregar, onModificar, onEliminar }: Props) {
  return (
    <div>
      <h4 className="text-xl font-semibold mb-2">Módulos</h4>
      {modulos.map((modulo, index) => (
        <div key={modulo.id || index} className="border p-3 rounded mb-2">
          <input
            type="text"
            placeholder="Título del módulo"
            value={modulo.titulo}
            onChange={(e) => onModificar(index, 'titulo', e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <textarea
            placeholder="Descripción del módulo"
            value={modulo.descripcion}
            onChange={(e) => onModificar(index, 'descripcion', e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Video URL (opcional)"
            value={modulo.videoUrl || ''}
            onChange={(e) => onModificar(index, 'videoUrl', e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <input
            type="text"
            placeholder="PDF URL (opcional)"
            value={modulo.pdfUrl || ''}
            onChange={(e) => onModificar(index, 'pdfUrl', e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <button
            type="button"
            className="text-red-600 text-sm"
            onClick={() => onEliminar(index)}
          >
            Eliminar módulo
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAgregar}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
      >
        Agregar Módulo
      </button>
    </div>
  );
}
