'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Curso } from '@/app/types/curso';

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCursos() {
      try {
        setCargando(true);
        const res = await fetch('http://localhost:3001/api/cursos');
        if (!res.ok) throw new Error('Error al cargar cursos');
        const data = await res.json();
        setCursos(data);
        setError('');
      } catch {
        setError('No se pudieron cargar los cursos');
      } finally {
        setCargando(false);
      }
    }
    fetchCursos();
  }, []);

  if (cargando) return <p>Cargando cursos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cursos disponibles</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cursos.map((curso) => (
          <li key={curso.id}>
            <Link
              href={`/cursos/${curso.id}`}
              className="block border rounded overflow-hidden hover:shadow-lg bg-white transition-transform transform hover:-translate-y-1"
            >
              {curso.imagenCurso ? (
                <img
                  src={`http://localhost:3001/uploads/imagenes-cursos/${curso.imagenCurso}`}
                  alt={curso.titulo}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}
              <div className="p-4 flex flex-col">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">{curso.titulo}</h2>
                <p className="text-sm text-gray-700">{curso.descripcion}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
