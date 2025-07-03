'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Curso, Modulo } from '@/app/types/curso';

export default function CursoPage() {
  const params = useParams();
  const router = useRouter();
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
    return `http://localhost:3000${scormPath}`;
  };

  if (cargando) return <p className="p-6 text-center text-lg text-blue-400 animate-pulse">Cargando curso...</p>;
  if (error) return <p className="p-6 text-center text-red-500 text-lg">{error}</p>;
  if (!curso) return <p className="p-6 text-center text-lg text-blue-400">Curso no encontrado</p>;

  const imageUrl = curso.imagenCurso
    ? `http://localhost:3001${curso.imagenCurso}`
    : 'https://placehold.co/600x400/1e293b/64748b?text=Sin+Imagen';


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
    <div className="container mx-auto p-4 max-w-4xl bg-gray-900 shadow-2xl rounded-xl my-8 border border-blue-700/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-90 z-0"></div>
      <div className="relative z-10">
        {!pagado ? (
          <div className="text-center space-y-6 text-white">
            {curso.imagenCurso && (
              <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden border border-blue-500/30 shadow-lg">
                <img
                  src={imageUrl}
                  alt={curso.titulo}
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  className="rounded-lg transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 border-b-2 border-blue-700/50 pb-4">
              {curso.titulo}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div>
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">Detalles Generales</h2>
                <p className="text-gray-300 mb-2"><strong>Descripción:</strong> {curso.descripcion}</p>
                <p className="text-gray-300 mb-2"><strong>Tipo:</strong> <span className="text-blue-400">{curso.tipo}</span></p>
                <p className="text-gray-300 mb-2"><strong>Categoría:</strong> <span className="text-blue-400">{curso.categoria}</span></p>
                <p className="text-gray-300 mb-2"><strong>Duración:</strong> <span className="text-blue-400">{curso.duracionHoras} horas</span></p>
                <p className="text-gray-300 mb-2"><strong>Precio:</strong> <span className="text-green-400 text-xl font-bold">${precioFormateado}</span></p>
                <p className="text-gray-300 mb-2"><strong>Modalidad:</strong> <span className="text-blue-400">{curso.modalidad}</span></p>
                <p className="text-gray-300 mb-2"><strong>Certificado Disponible:</strong> {curso.certificadoDisponible ? <span className="text-green-500">Sí</span> : <span className="text-red-500">No</span>}</p>
                <p className="text-gray-300 mb-2"><strong>Badge Disponible:</strong> {curso.badgeDisponible ? <span className="text-green-500">Sí</span> : <span className="text-red-500">No</span>}</p>
              </div>

              {curso.modulos && curso.modulos.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-blue-300 mb-4">Módulos del Curso</h2>
                  <ul className="list-none space-y-4"> 
                    {curso.modulos.map((modulo: Modulo) => (
                      <li key={modulo.id} className="text-gray-300 border border-blue-600/30 p-4 rounded-lg shadow-inner bg-gray-800 hover:bg-gray-700 transition duration-300 cursor-pointer">
                        <strong className="text-purple-400 block mb-1">{modulo.titulo}:</strong> <span className="text-gray-400">{modulo.descripcion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handlePagoExitoso}
              className="mt-6 px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold rounded-full hover:from-green-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg border border-transparent hover:border-white/50"
            >
              ¡Inscribirme ahora!
            </button>

        
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/cursos')}
                className="inline-block bg-gray-700 text-blue-300 font-bold py-3 px-6 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out shadow-md border border-gray-600 hover:border-blue-400"
              >
                Volver a Cursos
              </button>
            </div>
          </div>
        ) : (

          <div className="text-center space-y-6 text-white">
            <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Contenido del Curso: {curso.titulo}</h1>


            <button
              onClick={() => router.push('/cursos')}
              className="mb-6 px-6 py-2 bg-gray-700 text-blue-300 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out flex items-center mx-auto shadow-md border border-gray-600 hover:border-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Volver a Cursos
            </button>

            {curso.archivoScorm && curso.archivoScorm.indexOf('.html') !== -1 ? (
              <div className="mt-6 p-4 border border-blue-700 bg-gray-800 rounded-lg flex flex-col items-center shadow-inner">
                <iframe
                  key={curso.archivoScorm}
                  src={getScormLaunchUrl(curso.archivoScorm)}
                  width="100%"
                  height="600px"
                  title={`SCORM Course: ${curso.titulo}`}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-lg shadow-md border border-blue-600"
                />
              </div>
            ) : (
              <p className="text-gray-400 text-lg">No hay contenido SCORM válido disponible para este curso.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
