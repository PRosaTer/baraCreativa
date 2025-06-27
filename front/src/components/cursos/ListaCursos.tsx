"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Curso } from '@/app/types/curso';

export default function ListaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/cursos')
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al obtener cursos');
        }
        return res.json();
      })
      .then((data: Curso[]) => {
        setCursos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg">Cargando cursos...</p>;
  if (error) return <p className="text-red-600 text-center text-lg">Error: {error}</p>;
  if (cursos.length === 0) return <p className="text-center text-lg">No hay cursos disponibles.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
      {cursos.map((curso) => (
        <Link href={`/cursos/${curso.id}`} key={curso.id}>
          <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
            {curso.imagenCurso ? (
              <img
                src={`http://localhost:3001/uploads/${curso.imagenCurso}`}
                alt={curso.titulo}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Sin imagen</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-[var(--primary)]">{curso.titulo}</h3>
              <p className="text-gray-700 text-sm">{curso.descripcion}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}