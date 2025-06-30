import React from 'react';
import { ModuloForm } from '@/app/types/curso';

interface Props {
  modulos: ModuloForm[];
  onAgregar: () => void;
  onModificar: (index: number, campo: keyof ModuloForm, valor: string | File | null) => void;
  onEliminar: (index: number) => void;
}

export default function ListaModulos({ modulos, onAgregar, onModificar, onEliminar }: Props) {
  return (
    <div>
      {modulos.map((modulo, index) => (
        <div key={index} className="border p-3 my-2">
          <input
            value={modulo.titulo}
            onChange={(e) => onModificar(index, 'titulo', e.target.value)}
            placeholder="Título"
            className="border p-1 w-full mb-2"
          />
          <textarea
            value={modulo.descripcion}
            onChange={(e) => onModificar(index, 'descripcion', e.target.value)}
            placeholder="Descripción"
            className="border p-1 w-full mb-2"
          />
     
          <button onClick={() => onEliminar(index)} className="bg-red-500 text-white px-2 py-1 rounded">
            Eliminar
          </button>
        </div>
      ))}
      <button onClick={onAgregar} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Agregar módulo
      </button>
    </div>
  );
}
