'use client';

import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  datos: Omit<Curso, 'id' | 'modulos' | 'archivoScorm' | 'videoCurso' | 'pdfCurso'>;
  setDatos: Dispatch<SetStateAction<Omit<Curso, 'id' | 'modulos' | 'archivoScorm' | 'videoCurso' | 'pdfCurso'>>>;
  imagenArchivo: File | null;
  setImagenArchivo: Dispatch<SetStateAction<File | null>>;
  onNext: () => void;
}

export default function CrearCursoPaso1({ datos, setDatos, imagenArchivo, setImagenArchivo, onNext }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setDatos(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setDatos(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenArchivo(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block font-semibold mb-1" htmlFor="titulo">
          Título
        </label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={datos.titulo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="descripcion">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={datos.descripcion}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="precio">
          Precio
        </label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={datos.precio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={0}
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="duracionHoras">
          Duración (horas)
        </label>
        <input
          type="number"
          id="duracionHoras"
          name="duracionHoras"
          value={datos.duracionHoras}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          min={0}
          step={1}
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="tipo">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          value={datos.tipo}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione</option>
          <option value="Docentes">Docentes</option>
          <option value="Empresas">Empresas</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="modalidad">
          Modalidad
        </label>
        <select
          id="modalidad"
          name="modalidad"
          value={datos.modalidad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione</option>
          <option value="grabado">Grabado</option>
          <option value="en vivo">En vivo</option>
          <option value="mixto">Mixto</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="categoria">
          Categoría
        </label>
        <input
          type="text"
          id="categoria"
          name="categoria"
          value={datos.categoria}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="certificadoDisponible"
          name="certificadoDisponible"
          checked={datos.certificadoDisponible}
          onChange={handleChange}
        />
        <label htmlFor="certificadoDisponible" className="select-none">
          Certificado disponible
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="badgeDisponible"
          name="badgeDisponible"
          checked={datos.badgeDisponible}
          onChange={handleChange}
        />
        <label htmlFor="badgeDisponible" className="select-none">
          Badge disponible
        </label>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="imagenCurso">
          Imagen del curso
        </label>
        <input
          type="file"
          id="imagenCurso"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imagenArchivo && (
          <p className="mt-2 text-sm text-gray-600">{imagenArchivo.name}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Siguiente
      </button>
    </form>
  );
}
