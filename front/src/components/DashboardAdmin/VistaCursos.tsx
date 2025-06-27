'use client';

import React, { useEffect, useState } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoForm from '../CrearCursoForm/CrearCursoForm';
import { Curso } from '@/app/types/curso';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/cursos');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener cursos');
      }
      const data = await res.json();
      if (Array.isArray(data)) setCursos(data);
      else if (Array.isArray(data.cursos)) setCursos(data.cursos);
    } catch (err: any) {
      setError(err.message);
      console.error('Error al cargar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleGuardar = async (formData: FormData) => {
    try {
      if (cursoSeleccionado) {
        const res = await fetch(`http://localhost:3001/api/cursos/${cursoSeleccionado.id}`, {
          method: 'PATCH',
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al actualizar curso');
        }
        const actualizado: Curso = await res.json();
        setCursos((prev) => prev.map((c) => (c.id === actualizado.id ? actualizado : c)));
        alert('Curso actualizado con éxito!');
      } else {
        const res = await fetch('http://localhost:3001/api/cursos', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al crear curso');
        }
        const creado: Curso = await res.json();
        setCursos((prev) => [...prev, creado]);
        alert('Curso creado con éxito!');
      }

      setCursoSeleccionado(null);
      setMostrarFormulario(false);
      fetchCursos();
    } catch (err: any) {
      alert(`Error al guardar el curso: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar curso');
      }
      setCursos((prev) => prev.filter((c) => c.id !== id));
      alert('Curso eliminado con éxito!');
    } catch (err: any) {
      alert(`Error al eliminar el curso: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  if (loading && !mostrarFormulario) return <p className="text-center text-lg mt-10">Cargando cursos...</p>;
  if (error && !mostrarFormulario) return <p className="text-red-600 text-center text-lg mt-10">Error: {error}</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--primary)] text-center">Gestión de Cursos y Servicios</h2>

      {!mostrarFormulario && (
        <button
          onClick={() => {
            setCursoSeleccionado(null);
            setMostrarFormulario(true);
          }}
          className="mb-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
        >
          Crear Nuevo Curso
        </button>
      )}

      {mostrarFormulario ? (
        <CrearCursoForm
          cursoInicial={cursoSeleccionado || undefined}
          onSubmit={handleGuardar}
          onCancelar={() => {
            setMostrarFormulario(false);
            setCursoSeleccionado(null);
          }}
        />
      ) : (
        <TablaCursosAdmin
          cursos={cursos}
          onEditar={(curso) => {
            setCursoSeleccionado(curso);
            setMostrarFormulario(true);
          }}
          onEliminar={handleEliminar}
        />
      )}
    </div>
  );
}