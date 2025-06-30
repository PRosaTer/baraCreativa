import React from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  precio: number | string;
  setPrecio: (v: number | string) => void;
  tipo: Curso['tipo'];
  setTipo: (v: Curso['tipo']) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  duracionHoras: number | string;
  setDuracionHoras: (v: number | string) => void;
  modalidad: Curso['modalidad'];
  setModalidad: (v: Curso['modalidad']) => void;
  certificadoDisponible: boolean;
  setCertificadoDisponible: (v: boolean) => void;
  badgeDisponible: boolean;
  setBadgeDisponible: (v: boolean) => void;
}

export default function FormularioBasico({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  precio,
  setPrecio,
  tipo,
  setTipo,
  categoria,
  setCategoria,
  duracionHoras,
  setDuracionHoras,
  modalidad,
  setModalidad,
  certificadoDisponible,
  setCertificadoDisponible,
  badgeDisponible,
  setBadgeDisponible,
}: Props) {
  return (
    <>
      <div>
        <label className="block text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Duración (horas)</label>
          <input
            type="number"
            value={duracionHoras}
            onChange={(e) => setDuracionHoras(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as Curso['tipo'])}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="Docentes">Docentes</option>
            <option value="Empresas">Empresas</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Modalidad</label>
          <select
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value as Curso['modalidad'])}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="grabado">Grabado</option>
            <option value="en vivo">En vivo</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Categoría</label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={certificadoDisponible}
            onChange={(e) => setCertificadoDisponible(e.target.checked)}
          />
          <span>Certificado disponible</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={badgeDisponible}
            onChange={(e) => setBadgeDisponible(e.target.checked)}
          />
          <span>Badge disponible</span>
        </label>
      </div>
    </>
  );
}
