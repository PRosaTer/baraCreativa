'use client';

import Image from 'next/image';
import React from 'react';
import { Curso, Modulo } from '@/app/types/curso';

interface Props {
  curso: Curso;
}

export default function CursoDetalle({ curso }: Props) {
  let precioNumerico: number;
  if (typeof curso.precio === 'string') {
    precioNumerico = parseFloat(curso.precio);
  } else if (typeof curso.precio === 'number') {
    precioNumerico = curso.precio;
  } else {
    precioNumerico = 0;
  }

  const precioFormateado = !isNaN(precioNumerico) ? precioNumerico.toFixed(2) : 'N/A';

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white shadow-lg rounded-lg my-8">
      {curso.imagenCurso && (
        <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
          <Image
            src={`http://localhost:3001${curso.imagenCurso}`}
            alt={curso.titulo}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-4">
        {curso.titulo}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detalles Generales</h2>
          <p className="text-gray-700 mb-2"><strong>Descripción:</strong> {curso.descripcion}</p>
          <p className="text-gray-700 mb-2"><strong>Tipo:</strong> {curso.tipo}</p>
          <p className="text-gray-700 mb-2"><strong>Categoría:</strong> {curso.categoria}</p>
          <p className="text-gray-700 mb-2"><strong>Duración:</strong> {curso.duracionHoras} horas</p>
          <p className="text-gray-700 mb-2"><strong>Precio:</strong> ${precioFormateado}</p>
          <p className="text-gray-700 mb-2"><strong>Modalidad:</strong> {curso.modalidad}</p>
          <p className="text-gray-700 mb-2"><strong>Certificado Disponible:</strong> {curso.certificadoDisponible ? 'Sí' : 'No'}</p>
          <p className="text-gray-700 mb-2"><strong>Badge Disponible:</strong> {curso.badgeDisponible ? 'Sí' : 'No'}</p>
        </div>

        {curso.modulos && curso.modulos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Módulos del Curso</h2>
            <ul className="list-disc list-inside space-y-4">
              {curso.modulos.map((modulo: Modulo) => (
                <li key={modulo.id} className="text-gray-700 border p-4 rounded shadow-sm">
                  <strong className="text-indigo-600">{modulo.titulo}:</strong> {modulo.descripcion}
                  {/* Si querés mostrar video o pdf desde módulos, podés agregar acá, pero si usás SCORM, se puede omitir */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <a
          href="/cursos"
          className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Volver a Cursos
        </a>
      </div>
    </div>
  );
}
