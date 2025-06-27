'use client';

import React, { ChangeEvent } from 'react';
import { CursoForm } from './CrearCursoForm';

interface BasicosProps {
  datos: CursoForm;
  setDatos: React.Dispatch<React.SetStateAction<CursoForm>>;
  onSiguiente: () => void;
  onCancelar: () => void;
}

export default function Basicos({ datos, setDatos, onSiguiente, onCancelar }: BasicosProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;

    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setDatos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSiguiente();
      }}
      className="space-y-6 max-w-4xl mx-auto p-4 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Crear Nuevo Curso - Paso 1: Información Básica</h2>

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título del Curso</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={datos.titulo}
          onChange={handleChange}
          placeholder="Título del curso"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={datos.descripcion}
          onChange={handleChange}
          placeholder="Descripción detallada del curso"
          rows={4}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          id="tipo"
          name="tipo"
          value={datos.tipo}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="Docentes">Docentes</option>
          <option value="Empresas">Empresas</option>
        </select>
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
        <input
          type="text"
          id="categoria"
          name="categoria"
          value={datos.categoria}
          onChange={handleChange}
          placeholder="Ej: Programación, Diseño, Marketing"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="duracionHoras" className="block text-sm font-medium text-gray-700">Duración (Horas)</label>
        <input
          type="number"
          id="duracionHoras"
          name="duracionHoras"
          value={datos.duracionHoras}
          onChange={handleChange}
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={datos.precio}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
        <select
          id="modalidad"
          name="modalidad"
          value={datos.modalidad}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="en vivo">En vivo</option>
          <option value="grabado">Grabado</option>
          <option value="mixto">Mixto</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="certificadoDisponible"
          name="certificadoDisponible"
          checked={datos.certificadoDisponible}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="certificadoDisponible" className="ml-2 block text-sm text-gray-900">Certificado Disponible</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="badgeDisponible"
          name="badgeDisponible"
          checked={datos.badgeDisponible}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="badgeDisponible" className="ml-2 block text-sm text-gray-900">Badge Disponible</label>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}