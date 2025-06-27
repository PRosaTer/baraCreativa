'use client';

import React, { ChangeEvent } from 'react';

interface ModuloForm {
  titulo: string;
  descripcion: string;
  videoFile?: File;
  pdfFile?: File;
}

interface Props {
  modulos: ModuloForm[];
  setModulos: React.Dispatch<React.SetStateAction<ModuloForm[]>>;
  imagenCurso: File | null;
  setImagenCurso: React.Dispatch<React.SetStateAction<File | null>>;
  onAnterior: () => void;
  onSubmit: () => Promise<void>;
  guardando: boolean;
}

export default function Avanzado({ modulos, setModulos, imagenCurso, setImagenCurso, onAnterior, onSubmit, guardando }: Props) {
  const handleModuloChange = (index: number, field: keyof ModuloForm, value: any) => {
    const newModulos = [...modulos];
    newModulos[index] = { ...newModulos[index], [field]: value };
    setModulos(newModulos);
  };

  const agregarModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '' }]);
  };

  const eliminarModulo = (index: number) => {
    const newModulos = [...modulos];
    newModulos.splice(index, 1);
    setModulos(newModulos);
  };

  const handleImagenChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenCurso(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Curso - Paso 2</h2>

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

      <h3 className="text-xl font-semibold mt-6 mb-4">Módulos del Curso</h3>
      <div className="space-y-4">
        {modulos.map((modulo, i) => (
          <div key={i} className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-lg mb-2">Módulo {i + 1}</h4>
            <input
              type="text"
              value={modulo.titulo}
              onChange={(e) => handleModuloChange(i, 'titulo', e.target.value)}
              placeholder="Título del módulo"
              required
              className="w-full border p-2 rounded mb-2"
            />
            <textarea
              value={modulo.descripcion}
              onChange={(e) => handleModuloChange(i, 'descripcion', e.target.value)}
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
                  e.target.files && handleModuloChange(i, 'videoFile', e.target.files[0])
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
                  e.target.files && handleModuloChange(i, 'pdfFile', e.target.files[0])
                }
                className="block mt-1"
              />
            </label>

            <button
              type="button"
              onClick={() => eliminarModulo(i)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Eliminar módulo
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarModulo}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Agregar módulo
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onAnterior}
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Anterior
        </button>

        <button
          type="submit"
          disabled={guardando}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar Curso'}
        </button>
      </div>
    </form>
  );
}