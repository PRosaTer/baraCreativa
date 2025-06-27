'use client';

import React, { ChangeEvent } from 'react';
import { CursoForm } from './CrearCursoForm';


interface ModuloForm {
  titulo: string;
  descripcion: string;
  videoFile?: File;
  pdfFile?: File;
}

interface AvanzadoProps {
  modulos: ModuloForm[];
  setModulos: React.Dispatch<React.SetStateAction<ModuloForm[]>>;
  imagenCurso: File | null;
  setImagenCurso: React.Dispatch<React.SetStateAction<File | null>>;
  onAnterior: () => void;
  onSubmit: () => Promise<void>;
  guardando: boolean;
}

export default function Avanzado({
  modulos,
  setModulos,
  imagenCurso,
  setImagenCurso,
  onAnterior,
  onSubmit,
  guardando,
}: AvanzadoProps) {
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
    } else {
      setImagenCurso(null);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Crear Nuevo Curso - Paso 2: Contenido y Archivos</h2>


      <div>
        <label htmlFor="imagenCurso" className="block text-sm font-medium text-gray-700">
          Imagen Principal del Curso
        </label>
        <input
          type="file"
          id="imagenCurso"
          accept="image/*"
          onChange={handleImagenChange}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
        />
        {imagenCurso && (
          <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {imagenCurso.name}</p>
        )}
      </div>


      <div className="space-y-4 border border-gray-200 p-4 rounded-md bg-gray-50">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Módulos del Curso</h3>
        {modulos.map((modulo, i) => (
          <div key={i} className="border border-gray-300 p-4 rounded-md bg-white shadow-sm space-y-3">
            <h4 className="text-lg font-medium text-gray-700">Módulo {i + 1}</h4>
            <div>
              <label htmlFor={`modulo-titulo-${i}`} className="block text-sm font-medium text-gray-700">Título del Módulo</label>
              <input
                type="text"
                id={`modulo-titulo-${i}`}
                value={modulo.titulo}
                onChange={(e) => handleModuloChange(i, 'titulo', e.target.value)}
                placeholder="Título del módulo"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor={`modulo-descripcion-${i}`} className="block text-sm font-medium text-gray-700">Descripción del Módulo</label>
              <textarea
                id={`modulo-descripcion-${i}`}
                value={modulo.descripcion}
                onChange={(e) => handleModuloChange(i, 'descripcion', e.target.value)}
                placeholder="Descripción del módulo"
                rows={2}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>

            <div>
              <label htmlFor={`modulo-video-${i}`} className="block text-sm font-medium text-gray-700">
                Video del Módulo (opcional)
              </label>
              <input
                type="file"
                id={`modulo-video-${i}`}
                accept="video/*"
                onChange={(e) => e.target.files && handleModuloChange(i, 'videoFile', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
              />
              {modulo.videoFile && (
                <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {modulo.videoFile.name}</p>
              )}
            </div>

            <div>
              <label htmlFor={`modulo-pdf-${i}`} className="block text-sm font-medium text-gray-700">
                PDF del Módulo (opcional)
              </label>
              <input
                type="file"
                id={`modulo-pdf-${i}`}
                accept="application/pdf"
                onChange={(e) => e.target.files && handleModuloChange(i, 'pdfFile', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm p-2"
              />
              {modulo.pdfFile && (
                <p className="mt-2 text-sm text-gray-500">Archivo seleccionado: {modulo.pdfFile.name}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => eliminarModulo(i)}
              className="mt-2 px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              Eliminar Módulo
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarModulo}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Agregar Módulo
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onAnterior}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
        >
          Anterior
        </button>

        <button
          type="submit"
          disabled={guardando}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardando ? 'Guardando...' : 'Guardar Curso'}
        </button>
      </div>
    </form>
  );
}