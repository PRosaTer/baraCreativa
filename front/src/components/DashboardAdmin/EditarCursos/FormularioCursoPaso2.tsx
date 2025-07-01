'use client';

import React, { ChangeEvent } from 'react';
import { ModuloForm } from '@/app/types/curso';

interface Props {
  modulos: ModuloForm[];
  setModulos: React.Dispatch<React.SetStateAction<ModuloForm[]>>;
  onSubmit: () => Promise<void>;
}

export default function FormularioCursoPaso2({ modulos, setModulos, onSubmit }: Props) {
  const handleCambiarModulo = (index: number, campo: keyof ModuloForm, valor: string | File[] | null) => {
    const copia = [...modulos];
    if (campo === 'videos' || campo === 'pdfs' || campo === 'imagenes') {
      if (Array.isArray(valor)) {
        copia[index][campo] = valor;
      }
    } else if (campo === 'videoUrl' || campo === 'pdfUrl') {
      copia[index][campo] = valor as string | null;
    } else {
      copia[index][campo] = valor as string;
    }
    setModulos(copia);
  };

  const agregarModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '', videos: [], pdfs: [], imagenes: [], videoUrl: null, pdfUrl: null }]);
  };

  const eliminarModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
  };

  const handleFilesChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    campo: 'videos' | 'pdfs' | 'imagenes'
  ) => {
    if (!e.target.files) return;
    const archivosArray = Array.from(e.target.files);
    handleCambiarModulo(index, campo, archivosArray);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Agregar Módulos</h2>
      {modulos.map((mod, index) => (
        <div key={index} className="border rounded p-4 mb-4 bg-gray-50 relative">
          <button
            type="button"
            onClick={() => eliminarModulo(index)}
            className="absolute top-2 right-2 text-red-600 font-bold hover:underline"
          >
            Eliminar módulo
          </button>

          <label className="block mb-2 font-semibold">
            Título:
            <input
              type="text"
              value={mod.titulo}
              onChange={(e) => handleCambiarModulo(index, 'titulo', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="Título del módulo"
            />
          </label>

          <label className="block mb-2 font-semibold">
            Descripción:
            <textarea
              value={mod.descripcion}
              onChange={(e) => handleCambiarModulo(index, 'descripcion', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="Descripción del módulo"
              rows={3}
            />
          </label>

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
          {mod.videos.length > 0 && (
            <ul className="list-disc list-inside mb-4">
              {mod.videos.map((file, i) => (
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
          {mod.pdfs.length > 0 && (
            <ul className="list-disc list-inside mb-4">
              {mod.pdfs.map((file, i) => (
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
          {mod.imagenes.length > 0 && (
            <ul className="list-disc list-inside mb-4">
              {mod.imagenes.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={agregarModulo}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Agregar módulo
      </button>

      <button
        type="button"
        onClick={onSubmit}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Guardar Curso
      </button>
    </div>
  );
}
