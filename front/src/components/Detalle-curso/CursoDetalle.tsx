'use client';

import React from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  curso: Curso;
}

export default function CursoDetalle({ curso }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
      <p className="mb-4">{curso.descripcion}</p>

      {curso.imagenCurso && (
        <img
          src={`http://localhost:3001/uploads/cursos/${curso.imagenCurso}`}
          alt={`Imagen del curso ${curso.titulo}`}
          className="mb-6 max-w-full rounded"
        />
      )}

      {curso.archivoScorm && (
        <div className="mb-6">
          <a
            href={`http://localhost:3001/uploads/cursos/${curso.archivoScorm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Descargar paquete SCORM
          </a>
        </div>
      )}

      {curso.videoCurso && (
        <video controls width="100%" className="mb-6" src={`http://localhost:3001/uploads/cursos/${curso.videoCurso}`} />
      )}

      {curso.pdfCurso && (
        <iframe
          src={`http://localhost:3001/uploads/cursos/${curso.pdfCurso}`}
          width="100%"
          height="600"
          title="PDF del curso"
          className="mb-6 border"
        />
      )}
    </div>
  );
}
