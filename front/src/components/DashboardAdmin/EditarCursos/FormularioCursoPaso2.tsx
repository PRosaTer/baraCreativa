'use client';

import React, { useState, ChangeEvent } from 'react';
import { ModuloForm } from '@/app/types/curso';

interface Props {
  modulos: ModuloForm[];
  setModulos: React.Dispatch<React.SetStateAction<ModuloForm[]>>;
  onSubmit: () => Promise<void>;
}

interface ArchivoModulo {
  videoUrl?: string;
  pdfUrl?: string;
  imagenUrl?: string;
  videoArchivo?: File | null;
  pdfArchivo?: File | null;
  imagenArchivo?: File | null;
}

export default function CrearCursoPaso2({ modulos, setModulos, onSubmit }: Props) {
  const [archivos, setArchivos] = useState<ArchivoModulo[]>(
    modulos.map(() => ({
      videoUrl: '',
      pdfUrl: '',
      imagenUrl: '',
      videoArchivo: null,
      pdfArchivo: null,
      imagenArchivo: null,
    }))
  );


  const agregarModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '' }]);
    setArchivos([
      ...archivos,
      {
        videoUrl: '',
        pdfUrl: '',
        imagenUrl: '',
        videoArchivo: null,
        pdfArchivo: null,
        imagenArchivo: null,
      },
    ]);
  };

  const eliminarModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
    setArchivos(archivos.filter((_, i) => i !== index));
  };


  const handleCambiarModulo = (index: number, campo: keyof ModuloForm, valor: string) => {
    const copia = [...modulos];
    copia[index] = { ...copia[index], [campo]: valor };
    setModulos(copia);
  };


  const handleCambiarUrl = (
    index: number,
    tipo: 'videoUrl' | 'pdfUrl' | 'imagenUrl',
    valor: string
  ) => {
    const copia = [...archivos];
    copia[index][tipo] = valor;
    setArchivos(copia);
  };

  const handleArchivoChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    tipo: 'videoArchivo' | 'pdfArchivo' | 'imagenArchivo'
  ) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    const copia = [...archivos];
    copia[index][tipo] = file;
    setArchivos(copia);


    if (tipo === 'videoArchivo') copia[index].videoUrl = '';
    if (tipo === 'pdfArchivo') copia[index].pdfUrl = '';
    if (tipo === 'imagenArchivo') copia[index].imagenUrl = '';

    setArchivos(copia);
  };


  const eliminarArchivo = (index: number, tipo: 'videoArchivo' | 'pdfArchivo' | 'imagenArchivo') => {
    const copia = [...archivos];
    copia[index][tipo] = null;
    setArchivos(copia);
  };


  const renderArchivoPreview = (archivoModulo: ArchivoModulo, index: number) => {
    return (
      <div className="mb-2">
        {(archivoModulo.imagenArchivo || archivoModulo.imagenUrl) && (
          <div className="mb-2">
            <strong>Imagen:</strong>{' '}
            {archivoModulo.imagenArchivo ? (
              <span>{archivoModulo.imagenArchivo.name}</span>
            ) : (
              <a
                href={archivoModulo.imagenUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {archivoModulo.imagenUrl}
              </a>
            )}
            {archivoModulo.imagenArchivo && (
              <button
                type="button"
                onClick={() => eliminarArchivo(index, 'imagenArchivo')}
                className="ml-2 text-red-600 hover:underline"
              >
                Eliminar
              </button>
            )}
          </div>
        )}


        {(archivoModulo.videoArchivo || archivoModulo.videoUrl) && (
          <div className="mb-2">
            <strong>Video:</strong>{' '}
            {archivoModulo.videoArchivo ? (
              <span>{archivoModulo.videoArchivo.name}</span>
            ) : (
              <a
                href={archivoModulo.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {archivoModulo.videoUrl}
              </a>
            )}
            {archivoModulo.videoArchivo && (
              <button
                type="button"
                onClick={() => eliminarArchivo(index, 'videoArchivo')}
                className="ml-2 text-red-600 hover:underline"
              >
                Eliminar
              </button>
            )}
          </div>
        )}

   
        {(archivoModulo.pdfArchivo || archivoModulo.pdfUrl) && (
          <div className="mb-2">
            <strong>PDF:</strong>{' '}
            {archivoModulo.pdfArchivo ? (
              <span>{archivoModulo.pdfArchivo.name}</span>
            ) : (
              <a
                href={archivoModulo.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {archivoModulo.pdfUrl}
              </a>
            )}
            {archivoModulo.pdfArchivo && (
              <button
                type="button"
                onClick={() => eliminarArchivo(index, 'pdfArchivo')}
                className="ml-2 text-red-600 hover:underline"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Agregar Módulos</h2>
      {modulos.map((mod, index) => (
        <div
          key={index}
          className="border rounded p-4 mb-4 bg-gray-50 relative"
        >
          <button
            type="button"
            onClick={() => eliminarModulo(index)}
            className="absolute top-2 right-2 text-red-600 font-bold hover:underline"
          >
            Eliminar módulo
          </button>

          <label className="block mb-2 font-semibold">
            Título:
            <input
              type="text"
              value={mod.titulo}
              onChange={(e) => handleCambiarModulo(index, 'titulo', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="Título del módulo"
            />
          </label>

          <label className="block mb-2 font-semibold">
            Descripción:
            <textarea
              value={mod.descripcion}
              onChange={(e) => handleCambiarModulo(index, 'descripcion', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="Descripción del módulo"
              rows={3}
            />
          </label>

    
          <label className="block mb-1 font-semibold">
            URL Video:
            <input
              type="text"
              value={archivos[index]?.videoUrl || ''}
              onChange={(e) => handleCambiarUrl(index, 'videoUrl', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="https://..."
            />
          </label>

     
          <label className="block mb-2 font-semibold">
            Subir archivo de video:
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleArchivoChange(e, index, 'videoArchivo')}
              className="mt-1 block w-full"
            />
          </label>

      
          <label className="block mb-1 font-semibold">
            URL PDF:
            <input
              type="text"
              value={archivos[index]?.pdfUrl || ''}
              onChange={(e) => handleCambiarUrl(index, 'pdfUrl', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="https://..."
            />
          </label>

  
          <label className="block mb-2 font-semibold">
            Subir archivo PDF:
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleArchivoChange(e, index, 'pdfArchivo')}
              className="mt-1 block w-full"
            />
          </label>

   
          <label className="block mb-1 font-semibold">
            URL Imagen:
            <input
              type="text"
              value={archivos[index]?.imagenUrl || ''}
              onChange={(e) => handleCambiarUrl(index, 'imagenUrl', e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="https://..."
            />
          </label>

   
          <label className="block mb-2 font-semibold">
            Subir archivo de imagen:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleArchivoChange(e, index, 'imagenArchivo')}
              className="mt-1 block w-full"
            />
          </label>

    
          {renderArchivoPreview(archivos[index], index)}
        </div>
      ))}

      <button
        type="button"
        onClick={agregarModulo}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        Agregar módulo
      </button>

      <button
        type="button"
        onClick={onSubmit}
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Guardar Curso
      </button>
    </div>
  );
}
