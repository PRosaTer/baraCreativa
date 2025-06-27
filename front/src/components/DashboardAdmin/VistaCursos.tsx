'use client';

import React, { useEffect, useState } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import FormularioCurso from './FormularioCursos';
import { Curso } from '@/app/types/curso';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/cursos')
      .then((res) => res.json())
      .then((data) => {
        console.log('📦 Respuesta del backend:', data);
        if (Array.isArray(data)) {
          setCursos(data);
        } else if (Array.isArray(data.cursos)) {
          setCursos(data.cursos);
        } else {
          console.error('❌ Formato inesperado en la respuesta del backend');
        }
      })
      .catch((err) => {
        console.error('Error al cargar cursos:', err);
      });
  }, []);

  const handleEditar = (curso: Curso) => {
    setCursoSeleccionado(curso);
  };

  const handleGuardar = async (formData: FormData) => {
    try {
      if (cursoSeleccionado) {
        const res = await fetch(`http://localhost:3001/api/cursos/${cursoSeleccionado.id}`, {
          method: 'PATCH',
          body: formData,
        });

        if (!res.ok) throw new Error('Error al actualizar curso');
        const actualizado: Curso = await res.json();

        setCursos((prev) =>
          prev.map((c) => (c.id === actualizado.id ? actualizado : c))
        );
      } else {
        const res = await fetch('http://localhost:3001/api/cursos', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Error al crear curso');
        const creado: Curso = await res.json();

        setCursos((prev) => [...prev, creado]);
      }

      setCursoSeleccionado(null);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="p-4 flex-1">
      <h2 className="text-xl font-semibold mb-4">Listado de Cursos</h2>

      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => setCursoSeleccionado(null)}
      >
        Nuevo Curso
      </button>

      {Array.isArray(cursos) && (
        <TablaCursosAdmin cursos={cursos} onEditar={handleEditar} />
      )}

      <hr className="my-6" />

      <FormularioCurso
        cursoInicial={cursoSeleccionado || undefined}
        onSubmit={handleGuardar}
      />
    </div>
  );
}
