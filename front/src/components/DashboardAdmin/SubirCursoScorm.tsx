'use client';

import React, { useState } from 'react';

interface Props {
  onCursoCreado: () => void;
}

export default function SubirCursoScorm({ onCursoCreado }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracionHoras, setDuracionHoras] = useState('');
  const [tipo, setTipo] = useState<'Docentes' | 'Empresas'>('Docentes');
  const [categoria, setCategoria] = useState('');
  const [modalidad, setModalidad] = useState<'en vivo' | 'grabado' | 'mixto'>('grabado');
  const [certificadoDisponible, setCertificadoDisponible] = useState(false);
  const [badgeDisponible, setBadgeDisponible] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);
  const [scormFile, setScormFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!scormFile) {
      setError('Debes subir el archivo SCORM (.zip).');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const crearCursoDto = {
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

      const res = await fetch('http://localhost:3001/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crearCursoDto),
      });

      if (!res.ok) throw new Error('Error al crear curso');
      const nuevoCurso = await res.json();
      const cursoId = nuevoCurso.id;

      if (imagen) {
        const formDataImg = new FormData();
        formDataImg.append('imagen', imagen);
        await fetch(`http://localhost:3001/cursos/${cursoId}/imagen`, {
          method: 'POST',
          body: formDataImg,
        });
      }

      const formDataScorm = new FormData();
      formDataScorm.append('scormFile', scormFile);
      await fetch(`http://localhost:3001/cursos/${cursoId}/scorm`, {
        method: 'POST',
        body: formDataScorm,
      });

      onCursoCreado();
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

      <div>
        <label>Imagen del curso (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImagen(e.target.files[0])}
          className="w-full"
        />
      </div>

      <div>
        <label>Archivo SCORM (.zip)</label>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => e.target.files && setScormFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear curso SCORM'}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
