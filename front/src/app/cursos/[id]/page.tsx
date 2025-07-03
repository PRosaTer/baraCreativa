'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Curso } from '@/app/types/curso';

export default function CursoPage() {
  const params = useParams();
  const id = params?.id;

  const [curso, setCurso] = useState<Curso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagado, setPagado] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchCurso() {
      try {
        setCargando(true);
        const res = await fetch(`http://localhost:3001/api/cursos/${id}`);
        if (!res.ok) throw new Error('Error al cargar curso');
        const data: Curso = await res.json();
        setCurso(data);
        setError('');
      } catch (err) {
        setError('No se pudo cargar el curso');
        console.error('Error fetching course:', err);
      } finally {
        setCargando(false);
      }
    }
    fetchCurso();
  }, [id]);

  function handlePagoExitoso() {
    setPagado(true);
  }

  const getScormLaunchUrl = (scormPath?: string | null) => {
    if (!scormPath || typeof scormPath !== 'string') return '';
    return `http://localhost:3001${scormPath}`;
  };

  if (cargando) return <p className="p-6 text-center">Cargando curso...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!curso) return <p className="p-6 text-center">Curso no encontrado</p>;

  const imageUrl = curso.imagenCurso
    ? `http://localhost:3001${curso.imagenCurso}`
    : 'https://placehold.co/600x400/E0E0E0/333333?text=Sin+Imagen';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!pagado ? (
        <div className="text-center space-y-6 border rounded-lg shadow p-6 bg-white">
          <h1 className="text-3xl font-bold">{curso.titulo}</h1>
          <p className="text-gray-700">{curso.descripcion}</p>

          <img
            src={imageUrl}
            alt={`Imagen del curso ${curso.titulo}`}
            className="mx-auto rounded-lg my-4 max-h-64 object-cover w-full"
          />

          <p className="text-xl font-semibold text-green-700">Precio: ${curso.precio}</p>

          <p className="text-sm text-gray-600">
            {curso.certificadoDisponible
              ? 'Incluye certificación al finalizar.'
              : 'No incluye certificación.'}
          </p>

          <button
            onClick={handlePagoExitoso}
            className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            ¡Inscribirme ahora!
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6 border rounded-lg shadow p-6 bg-white">
          <h1 className="text-3xl font-bold mb-4">Contenido del Curso: {curso.titulo}</h1>

          {curso.archivoScorm && curso.archivoScorm.indexOf('.html') !== -1 ? (
            <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg flex flex-col items-center">
              <iframe
                key={curso.archivoScorm}
                src={getScormLaunchUrl(curso.archivoScorm)}
                width="100%"
                height="600px"
                title={`SCORM Course: ${curso.titulo}`}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <p className="text-gray-600">No hay contenido SCORM válido disponible para este curso.</p>
          )}
        </div>
      )}
    </div>
  );
}
