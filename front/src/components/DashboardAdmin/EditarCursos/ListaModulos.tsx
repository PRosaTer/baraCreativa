import React, { ChangeEvent } from 'react';
import { ModuloForm } from '@/app/types/curso';

interface Props {
  modulos: ModuloForm[];
  onAgregar: () => void;
  onModificar: (index: number, campo: keyof ModuloForm, valor: string | File[] | string | null) => void;
  onEliminar: (index: number) => void;
}

export default function ListaModulos({ modulos, onAgregar, onModificar, onEliminar }: Props) {
  const handleFilesChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    campo: 'videos' | 'pdfs' | 'imagenes'
  ) => {
    if (!e.target.files) return;
    const archivosArray = Array.from(e.target.files);
    onModificar(index, campo, archivosArray);
  };

  return (
    <div>
      {modulos.map((modulo, index) => (
        <div key={index} className="border p-3 my-2 bg-gray-50 rounded">
          <input
            value={modulo.titulo}
            onChange={(e) => onModificar(index, 'titulo', e.target.value)}
            placeholder="Título"
            className="border p-1 w-full mb-2"
          />
          <textarea
            value={modulo.descripcion ?? ''}
            onChange={(e) => onModificar(index, 'descripcion', e.target.value)}
            placeholder="Descripción"
            className="border p-1 w-full mb-2"
          />

          <label className="block font-semibold mb-1">
            Videos (múltiples):
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFilesChange(e, index, 'videos')}
              className="mt-1 block w-full"
            />
          </label>
          {modulo.videos?.length > 0 && (
            <ul className="list-disc list-inside mb-2">
              {modulo.videos.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          <label className="block font-semibold mb-1">
            PDFs (múltiples):
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => handleFilesChange(e, index, 'pdfs')}
              className="mt-1 block w-full"
            />
          </label>
          {modulo.pdfs?.length > 0 && (
            <ul className="list-disc list-inside mb-2">
              {modulo.pdfs.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          <label className="block font-semibold mb-1">
            Imágenes (múltiples):
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesChange(e, index, 'imagenes')}
              className="mt-1 block w-full"
            />
          </label>
          {modulo.imagenes?.length > 0 && (
            <ul className="list-disc list-inside mb-2">
              {modulo.imagenes.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          <button onClick={() => onEliminar(index)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">
            Eliminar
          </button>
        </div>
      ))}
      <button onClick={onAgregar} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Agregar módulo
      </button>
    </div>
  );
}
