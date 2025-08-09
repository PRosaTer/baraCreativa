'use client';

import React, { useState } from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  curso: Curso;
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function EditarCursoScorm({ curso, onGuardado, onCancelar }: Props) {
  const tipoInicial: 'Docentes' | 'Empresas' =
    curso.tipo === 'Docentes' || curso.tipo === 'Empresas' ? curso.tipo : 'Docentes';

  const modalidadInicial: 'en vivo' | 'grabado' | 'mixto' =
    curso.modalidad === 'en vivo' || curso.modalidad === 'grabado' || curso.modalidad === 'mixto'
      ? curso.modalidad
      : 'en vivo';

  const [titulo, setTitulo] = useState(curso.titulo || '');
  const [descripcion, setDescripcion] = useState(curso.descripcion || '');
  const [precio, setPrecio] = useState(String(curso.precio || ''));
  const [duracionHoras, setDuracionHoras] = useState(String(curso.duracionHoras || ''));
  const [tipo, setTipo] = useState<'Docentes' | 'Empresas'>(tipoInicial);
  const [categoria, setCategoria] = useState(curso.categoria || '');
  const [modalidad, setModalidad] = useState<'en vivo' | 'grabado' | 'mixto'>(modalidadInicial);
  const [certificadoDisponible, setCertificadoDisponible] = useState(!!curso.certificadoDisponible);
  const [badgeDisponible, setBadgeDisponible] = useState(!!curso.badgeDisponible);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const datosActualizados = {
        titulo,
        descripcion,
        precio: Number(precio),
        duracionHoras: Number(duracionHoras),
        tipo,
        categoria,
        modalidad,
        certificadoDisponible,
        badgeDisponible,
      };

      await fetch(`http://localhost:3001/cursos/${curso.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados),
      });

      onGuardado();
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError('Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto p-4 border rounded">
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Duración en horas"
        value={duracionHoras}
        onChange={(e) => setDuracionHoras(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as 'Docentes' | 'Empresas')}
        className="w-full border p-2 rounded"
      >
        <option value="Docentes">Docentes</option>
        <option value="Empresas">Empresas</option>
      </select>

      <select
        value={modalidad}
        onChange={(e) => setModalidad(e.target.value as 'en vivo' | 'grabado' | 'mixto')}
        className="w-full border p-2 rounded"
      >
        <option value="en vivo">En vivo</option>
        <option value="grabado">Grabado</option>
        <option value="mixto">Mixto</option>
      </select>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={certificadoDisponible}
          onChange={(e) => setCertificadoDisponible(e.target.checked)}
          className="mr-2"
        />
        Certificado disponible
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={badgeDisponible}
          onChange={(e) => setBadgeDisponible(e.target.checked)}
          className="mr-2"
        />
        Badge disponible
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>

      <button
        onClick={onCancelar}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancelar
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
