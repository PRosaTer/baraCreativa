'use client';

import React, { useEffect, useState, use } from 'react';
import CursoDetalle from '@/components/Detalle-curso/CursoDetalle';
import { Curso } from '@/app/types/curso';

interface Props {
  params: Promise<{ id: string }>;
}

export default function CursoPage({ params }: Props) {
  const { id } = use(params);

  const [curso, setCurso] = useState<Curso | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [pagado, setPagado] = useState(false);

  useEffect(() => {
    async function fetchCurso() {
      try {
        setCargando(true);
        const res = await fetch(`http://localhost:3001/api/cursos/${id}`);
        if (!res.ok) throw new Error('Error al cargar curso');
        const data = await res.json();
        setCurso(data);
        setError('');
      } catch (err) {
        setError('No se pudo cargar el curso');
      } finally {
        setCargando(false);
      }
    }

    fetchCurso();
  }, [id]);


  function handlePagoExitoso() {
    setPagado(true);
  }

  if (cargando) return <p className="p-6 text-center">Cargando curso...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!curso) return <p className="p-6 text-center">Curso no encontrado</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {!pagado ? (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
          <p>Debes pagar para acceder a este curso.</p>


          <div id="paypal-button-container" />

          <button
            onClick={handlePagoExitoso}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simular pago exitoso
          </button>
        </div>
      ) : (
        <CursoDetalle curso={curso} />
      )}
    </div>
  );
}
