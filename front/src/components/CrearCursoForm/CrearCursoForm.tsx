'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Curso, ModuloForm } from '@/app/types/curso';

export interface CursoForm {
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: File | null;
  modulos: ModuloForm[];
}

interface Props {
  cursoInicial?: Curso;
  onSubmit: (formData: CursoForm) => Promise<void>;
  onCancelar: () => void;
}

export default function CrearCursoForm({ cursoInicial, onSubmit, onCancelar }: Props) {
  const [datos, setDatos] = useState<CursoForm>({
    titulo: '',
    descripcion: '',
    tipo: 'Docentes',
    categoria: '',
    duracionHoras: 1,
    precio: 0,
    modalidad: 'en vivo',
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    modulos: [],
  });

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cursoInicial) {
      setDatos({
        titulo: cursoInicial.titulo,
        descripcion: cursoInicial.descripcion,
        tipo: cursoInicial.tipo,
        categoria: cursoInicial.categoria,
        duracionHoras: cursoInicial.duracionHoras,
        precio: Number(cursoInicial.precio),
        modalidad: cursoInicial.modalidad,
        certificadoDisponible: cursoInicial.certificadoDisponible,
        badgeDisponible: cursoInicial.badgeDisponible,
        imagenCurso: null,
        modulos: cursoInicial.modulos || [],
      });
    }
  }, [cursoInicial]);

  
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;

    if (
      target instanceof HTMLInputElement &&
      (target.type === 'checkbox' || target.type === 'radio')
    ) {
      setDatos((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (target instanceof HTMLInputElement && target.type === 'number') {
      setDatos((prev) => ({
        ...prev,
        [name]: Number(target.value),
      }));
    } else {
      setDatos((prev) => ({
        ...prev,
        [name]: target.value,
      }));
    }
  };

  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDatos((prev) => ({ ...prev, imagenCurso: e.target.files![0] }));
    }
  };

  
  const agregarModulo = () => {
    setDatos((prev) => ({
      ...prev,
      modulos: [...prev.modulos, { titulo: '', descripcion: '' }],
    }));
  };

  
  const handleModuloChange = (
    index: number,
    field: 'titulo' | 'descripcion',
    value: string
  ) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos[index] = { ...nuevosModulos[index], [field]: value };
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
  };

  
  const eliminarModulo = (index: number) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos.splice(index, 1);
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onSubmit(datos);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6"
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-bold mb-4">
        {cursoInicial ? 'Editar Curso' : 'Crear Nuevo Curso'}
      </h2>

      <div>
        <label className="block mb-1 font-medium">Título</label>
        <input
          type="text"
          name="titulo"
          value={datos.titulo}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción</label>
        <textarea
          name="descripcion"
          value={datos.descripcion}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tipo</label>
        <select
          name="tipo"
          value={datos.tipo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Docentes">Docentes</option>
          <option value="Empresas">Empresas</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Categoría</label>
        <input
          type="text"
          name="categoria"
          value={datos.categoria}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Duración (horas)</label>
          <input
            type="number"
            name="duracionHoras"
            value={datos.duracionHoras}
            onChange={handleChange}
            min={1}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Precio</label>
          <input
            type="number"
            name="precio"
            value={datos.precio}
            onChange={handleChange}
            min={0}
            step={0.01}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Modalidad</label>
        <select
          name="modalidad"
          value={datos.modalidad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="en vivo">En vivo</option>
          <option value="grabado">Grabado</option>
          <option value="mixto">Mixto</option>
        </select>
      </div>

      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="certificadoDisponible"
            checked={datos.certificadoDisponible}
            onChange={handleChange}
          />
          <span>Certificado Disponible</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="badgeDisponible"
            checked={datos.badgeDisponible}
            onChange={handleChange}
          />
          <span>Badge Disponible</span>
        </label>
      </div>

      <div>
        <label className="block mb-1 font-medium">Imagen del Curso</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {datos.imagenCurso && (
          <p className="mt-2 text-sm text-gray-600">
            Archivo seleccionado: {datos.imagenCurso.name}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Módulos</h3>

        {datos.modulos.map((modulo, i) => (
          <div key={i} className="mb-4 p-4 border rounded bg-gray-50 relative">
            <label className="block mb-1 font-medium">Título Módulo {i + 1}</label>
            <input
              type="text"
              value={modulo.titulo}
              onChange={(e) => handleModuloChange(i, 'titulo', e.target.value)}
              required
              className="w-full border rounded px-3 py-2 mb-2"
            />

            <label className="block mb-1 font-medium">Descripción Módulo {i + 1}</label>
            <textarea
              value={modulo.descripcion}
              onChange={(e) => handleModuloChange(i, 'descripcion', e.target.value)}
              required
              rows={2}
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="button"
              onClick={() => eliminarModulo(i)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
              title="Eliminar módulo"
            >
              &times;
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarModulo}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Agregar Módulo
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          disabled={guardando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={guardando}
        >
          {guardando
            ? 'Guardando...'
            : cursoInicial
            ? 'Actualizar Curso'
            : 'Crear Curso'}
        </button>
      </div>
    </form>
  );
}
