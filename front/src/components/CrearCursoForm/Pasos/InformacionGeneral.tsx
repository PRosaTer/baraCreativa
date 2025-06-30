'use client';

import React from 'react';

interface Props {
  titulo: string;
  setTitulo: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  precio: string;
  setPrecio: (v: string) => void;
  duracionHoras: string;
  setDuracionHoras: (v: string) => void;
  tipo: 'Docentes' | 'Empresas';
  setTipo: (v: 'Docentes' | 'Empresas') => void;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  setModalidad: (v: 'en vivo' | 'grabado' | 'mixto') => void;
  categoria: string;
  setCategoria: (v: string) => void;
  certificadoDisponible: boolean;
  setCertificadoDisponible: (v: boolean) => void;
  badgeDisponible: boolean;
  setBadgeDisponible: (v: boolean) => void;
  imagenes: File[];
  setImagenes: (f: File[]) => void;
  videos: File[];
  setVideos: (f: File[]) => void;
  pdfs: File[];
  setPdfs: (f: File[]) => void;
}

export default function InformacionGeneral({
  titulo,
  setTitulo,
  descripcion,
  setDescripcion,
  precio,
  setPrecio,
  duracionHoras,
  setDuracionHoras,
  tipo,
  setTipo,
  modalidad,
  setModalidad,
  categoria,
  setCategoria,
  certificadoDisponible,
  setCertificadoDisponible,
  badgeDisponible,
  setBadgeDisponible,
  imagenes,
  setImagenes,
  videos,
  setVideos,
  pdfs,
  setPdfs,
}: Props) {
  return (
    <div className="space-y-4">
      <input
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
        placeholder="Duración (horas)"
        value={duracionHoras}
        onChange={(e) => setDuracionHoras(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
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

      <div className="flex items-center space-x-2">
        <label>Certificado disponible</label>
        <input
          type="checkbox"
          checked={certificadoDisponible}
          onChange={(e) => setCertificadoDisponible(e.target.checked)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <label>Badge disponible</label>
        <input
          type="checkbox"
          checked={badgeDisponible}
          onChange={(e) => setBadgeDisponible(e.target.checked)}
        />
      </div>

      <div>
        <label>Imágenes (multi)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) setImagenes(Array.from(e.target.files));
          }}
        />
        {imagenes.length > 0 && (
          <ul className="text-sm mt-2">
            {imagenes.map((img, i) => (
              <li key={i}>{img.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>Videos (multi)</label>
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => {
            if (e.target.files) setVideos(Array.from(e.target.files));
          }}
        />
        {videos.length > 0 && (
          <ul className="text-sm mt-2">
            {videos.map((v, i) => (
              <li key={i}>{v.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label>PDFs (multi)</label>
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files) setPdfs(Array.from(e.target.files));
          }}
        />
        {pdfs.length > 0 && (
          <ul className="text-sm mt-2">
            {pdfs.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
