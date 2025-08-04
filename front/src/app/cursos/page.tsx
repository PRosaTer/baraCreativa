'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

import {
  ClaseItem,
  TipoCurso,
  RawCursoApiResponse,
  Curso,
  ModuloResumen,
} from '@/app/types/curso';

export default function CursosPage() {
  const [items, setItems] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroAcademia, setFiltroAcademia] = useState<string>('');

  useEffect(() => {
    async function fetchItems() {
      try {
        setCargando(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/cursos`);

        if (!res.ok) {
          throw new Error(`Error al cargar items: ${res.statusText}`);
        }

        const dataFromApi: RawCursoApiResponse[] = await res.json();

        const processedData: Curso[] = dataFromApi.map((item) => ({
          ...item,
          precio: typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio,
          fechaInicio: item.fechaInicio ? new Date(item.fechaInicio) : null,
        }));

        setItems(processedData);
        setError('');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los items.';
        setError(errorMessage);
        console.error('Error fetching items:', err);
      } finally {
        setCargando(false);
      }
    }
    fetchItems();
  }, []);

  const { cursosDisponibles, serviciosDisponibles } = useMemo(() => {
    const cursos = items.filter(item => item.claseItem === ClaseItem.CURSO);
    const servicios = items.filter(item => item.claseItem === ClaseItem.SERVICIO);
    return { cursosDisponibles: cursos, serviciosDisponibles: servicios };
  }, [items]);

  const cursosFiltrados = useMemo(() => {
    if (filtroAcademia === '') {
      return cursosDisponibles;
    }
    return cursosDisponibles.filter(curso => curso.categoria === filtroAcademia);
  }, [cursosDisponibles, filtroAcademia]);

  if (cargando) return <p className="text-center text-lg mt-8 text-gray-700">Cargando contenido...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-800 border-b-2 border-blue-200 pb-3">
          Cursos Disponibles
        </h1>

 
        <div className="flex gap-3 mt-6">
          {['Todos', 'CAT', 'Dynamis'].map((opcion) => {
            const valor = opcion === 'Todos' ? '' : opcion;
            const activo = filtroAcademia === valor;
            return (
              <button
                key={opcion}
                onClick={() => setFiltroAcademia(valor)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 shadow-sm
                  ${
                    activo
                      ? 'bg-blue-600 text-white border-transparent shadow-md'
                      : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-100'
                  }`}
              >
                {opcion}
              </button>
            );
          })}
        </div>
      </div>

      {cursosFiltrados.length === 0 ? (
        <p className="text-gray-600 mb-12 p-4 bg-blue-50 rounded-lg shadow-sm">
          No hay cursos disponibles para la academia seleccionada.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {cursosFiltrados.map((curso) => (
            <li key={curso.id}>
              <Link
                href={`/cursos/${curso.id}`}
                className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg bg-white transition-all transform hover:-translate-y-1 relative h-full"
              >
                {curso.imagenCurso ? (
                  <img
                    src={`http://localhost:3001${curso.imagenCurso}`}
                    alt={curso.titulo}
                    className="w-full h-48 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gray-500 text-sm font-medium flex-shrink-0">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="ml-2">Sin imagen</span>
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-2">
                      {curso.titulo}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                      {curso.descripcion}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-auto">
                    {curso.precio > 0 && (
                      <p className="text-md font-bold text-green-600">
                        ${curso.precio.toFixed(2)}
                      </p>
                    )}
                    {curso.fechaInicio && (
                      <p className="text-xs text-gray-500 mt-1">
                        Inicio: {curso.fechaInicio.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Modalidad: {curso.modalidad === 'en vivo' ? 'En Vivo' : curso.modalidad === 'grabado' ? 'Grabado' : 'Mixto'}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h1 className="text-3xl font-bold mb-8 text-purple-800 border-b-2 border-purple-200 pb-3 mt-12">Nuestros Servicios</h1>
      {serviciosDisponibles.length === 0 ? (
        <p className="text-gray-600 mb-8 p-4 bg-purple-50 rounded-lg shadow-sm">
          No hay servicios disponibles en este momento. ¡Consulta nuestras soluciones a medida!
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {serviciosDisponibles.map((servicio) => (
            <li key={servicio.id}>
              <Link
                href={`/servicios/${servicio.id}`}
                className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg bg-white transition-all transform hover:-translate-y-1 relative h-full"
              >
                {servicio.imagenCurso ? (
                  <img
                    src={`http://localhost:3001${servicio.imagenCurso}`}
                    alt={servicio.titulo}
                    className="w-full h-48 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-gray-500 text-sm font-medium flex-shrink-0">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 4v12m-4-2v4m-4-6v6m1.5-1.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm9 0a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    <span className="ml-2">Sin imagen de servicio</span>
                  </div>
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-purple-700 mb-2 line-clamp-2">
                      {servicio.titulo}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                      {servicio.descripcion}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-auto">
                    {servicio.precio > 0 && (
                      <p className="text-md font-bold text-green-600">
                        ${servicio.precio.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
