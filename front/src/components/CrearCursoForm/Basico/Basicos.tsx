'use client';

import React, { ChangeEvent } from 'react';
import { CursoForm } from '@/app/types/curso';
import FormularioInput from './FormularioInput';
import FormularioTextarea from './FormularioTextarea';
import FormularioSelect from './FormularioSelect';
import FormularioCheckbox from './FormularioCheckbox';

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

    setDatos((prev: CursoForm) => ({
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
      <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">
        Crear Nuevo Curso - Paso 1: Información Básica
      </h2>

      <FormularioInput
        label="Título del Curso"
        id="titulo"
        name="titulo"
        value={datos.titulo}
        onChange={handleChange}
        placeholder="Título del curso"
        required
      />

      <FormularioTextarea
        label="Descripción"
        id="descripcion"
        name="descripcion"
        value={datos.descripcion}
        onChange={handleChange}
        placeholder="Descripción detallada del curso"
        required
      />

      <FormularioSelect
        label="Tipo"
        id="tipo"
        name="tipo"
        value={datos.tipo}
        onChange={handleChange}
        options={['Docentes', 'Empresas']}
        required
      />

      <FormularioInput
        label="Categoría"
        id="categoria"
        name="categoria"
        value={datos.categoria}
        onChange={handleChange}
        placeholder="Ej: Programación, Diseño, Marketing"
        required
      />

      <FormularioInput
        label="Duración (Horas)"
        id="duracionHoras"
        name="duracionHoras"
        value={datos.duracionHoras}
        onChange={handleChange}
        type="number"
        required
        min={1}
      />

      <FormularioInput
        label="Precio"
        id="precio"
        name="precio"
        value={datos.precio}
        onChange={handleChange}
        type="number"
        required
        min={0}
        step={0.01}
      />

      <FormularioSelect
        label="Modalidad"
        id="modalidad"
        name="modalidad"
        value={datos.modalidad}
        onChange={handleChange}
        options={['en vivo', 'grabado', 'mixto']}
        required
      />

      <FormularioCheckbox
        label="Certificado Disponible"
        id="certificadoDisponible"
        name="certificadoDisponible"
        checked={datos.certificadoDisponible}
        onChange={handleChange}
      />

      <FormularioCheckbox
        label="Badge Disponible"
        id="badgeDisponible"
        name="badgeDisponible"
        checked={datos.badgeDisponible}
        onChange={handleChange}
      />

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
