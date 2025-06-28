'use client';

import React from 'react';
import FormularioImagenCurso from './FormularioImagenCurso';
import FormularioModulo from './FormularioModulo';

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

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6 max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Curso - Paso 2</h2>

      <FormularioImagenCurso imagenCurso={imagenCurso} setImagenCurso={setImagenCurso} />

      <h3 className="text-xl font-semibold mt-6 mb-4">Módulos del Curso</h3>
      <div className="space-y-4">
        {modulos.map((modulo, i) => (
          <FormularioModulo
            key={i}
            index={i}
            modulo={modulo}
            handleModuloChange={handleModuloChange}
            eliminarModulo={eliminarModulo}
          />
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
