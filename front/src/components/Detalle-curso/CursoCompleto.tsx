'use client';

import React from 'react';
import { Curso, Modulo } from '@/app/types/curso';

interface Props {
  curso: Curso;
}

export default function CursoCompleto({ curso }: Props) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-4">{curso.titulo}</h1>
      <p className="text-lg mb-6">{curso.descripcion}</p>

      <div className="space-y-4">
        {curso.imagenCurso && (
          <img
            src={`http://localhost:3001/uploads/imagenes-cursos/${curso.imagenCurso}`}
            alt={`Imagen del curso ${curso.titulo}`}
            className="rounded shadow max-w-full"
          />
        )}

        {curso.archivoScorm && (
          <div>
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
      </div>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Módulos</h2>
        {curso.modulos && curso.modulos.length > 0 ? (
          curso.modulos.map((modulo: Modulo, index) => (
            <div key={index} className="border rounded p-4 mb-6 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">{modulo.titulo}</h3>
              <p className="mb-4">{modulo.descripcion}</p>

  
              {modulo.videoUrl && modulo.videoUrl.length > 0 && (
                <video
                  controls
                  src={modulo.videoUrl[0].startsWith('http')
                    ? modulo.videoUrl[0]
                    : `http://localhost:3001/uploads/cursos/${modulo.videoUrl[0]}`}
                  className="w-full rounded mb-4"
                />
              )}

              {modulo.pdfUrl && modulo.pdfUrl.length > 0 && modulo.pdfUrl[0].endsWith('.pdf') && (
                <iframe
                  src={modulo.pdfUrl[0].startsWith('http')
                    ? modulo.pdfUrl[0]
                    : `http://localhost:3001/uploads/cursos/${modulo.pdfUrl[0]}`}
                  title={`PDF del módulo ${modulo.titulo}`}
                  width="100%"
                  height="500"
                  className="border rounded mb-4"
                />
              )}

              {modulo.pdfUrl && modulo.pdfUrl.length > 0 && (modulo.pdfUrl[0].endsWith('.jpg') || modulo.pdfUrl[0].endsWith('.png') || modulo.pdfUrl[0].endsWith('.jpeg')) && (
                <img
                  src={modulo.pdfUrl[0].startsWith('http')
                    ? modulo.pdfUrl[0]
                    : `http://localhost:3001/uploads/cursos/${modulo.pdfUrl[0]}`}
                  alt={`Imagen módulo ${modulo.titulo}`}
                  className="rounded mb-4 max-w-full"
                />
              )}
            </div>
          ))
        ) : (
          <p>No hay módulos disponibles para este curso.</p>
        )}
      </section>
    </div>
  );
}
