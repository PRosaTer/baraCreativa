
'use client';

import React, { useEffect, useState } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoForm, { CursoForm } from '../CrearCursoForm/CrearCursoForm';
import { Curso } from '@/app/types/curso';

interface ErrorResponse {
  message?: string;
}

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const extraerMensajeError = async (response: Response): Promise<string> => {
    try {
      const data = (await response.json()) as ErrorResponse;
      return data.message || 'Error desconocido';
    } catch {
      return 'Error desconocido';
    }
  };

  const fetchCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/cursos');
      if (!res.ok) {
        const mensaje = await extraerMensajeError(res);
        throw new Error(mensaje);
      }
      const data = await res.json();
      if (Array.isArray(data)) setCursos(data);
      else if (Array.isArray(data.cursos)) setCursos(data.cursos);
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError('Error desconocido');
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleGuardar = async (cursoData: CursoForm) => {
    setLoading(true);
    try {
      const url = cursoSeleccionado
        ? `http://localhost:3001/api/cursos/${cursoSeleccionado.id}`
        : 'http://localhost:3001/api/cursos';

      const method = cursoSeleccionado ? 'PATCH' : 'POST';

      const formData = new FormData();

      formData.append('titulo', cursoData.titulo);
      formData.append('descripcion', cursoData.descripcion);
      formData.append('tipo', cursoData.tipo);
      formData.append('categoria', cursoData.categoria);
      formData.append('duracionHoras', cursoData.duracionHoras.toString());
      formData.append('precio', cursoData.precio.toString());
      formData.append('modalidad', cursoData.modalidad);
      formData.append('certificadoDisponible', cursoData.certificadoDisponible ? 'true' : 'false');
      formData.append('badgeDisponible', cursoData.badgeDisponible ? 'true' : 'false');

      if (cursoData.imagenCurso) {
        formData.append('imagenCurso', cursoData.imagenCurso);
      }

      formData.append('modulos', JSON.stringify(cursoData.modulos));

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const mensaje = await extraerMensajeError(res);
        throw new Error(mensaje);
      }

      const resultado: Curso = await res.json();

      if (cursoSeleccionado) {
        setCursos((prev) =>
          prev.map((c) => (c.id === resultado.id ? resultado : c))
        );
        alert('Curso actualizado con éxito!');
      } else {
        setCursos((prev) => [...prev, resultado]);
        alert('Curso creado con éxito!');
      }

      setCursoSeleccionado(null);
      setMostrarFormulario(false);
      fetchCursos();
    } catch (error: unknown) {
      if (error instanceof Error) alert(`Error al guardar el curso: ${error.message}`);
      else alert('Error al guardar el curso: Error desconocido');
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
        const mensaje = await extraerMensajeError(res);
        throw new Error(mensaje);
      }
      setCursos((prev) => prev.filter((c) => c.id !== id));
      alert('Curso eliminado con éxito!');
    } catch (error: unknown) {
      if (error instanceof Error) alert(`Error al eliminar el curso: ${error.message}`);
      else alert('Error al eliminar el curso: Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !mostrarFormulario)
    return <p className="text-center text-lg mt-10">Cargando cursos...</p>;
  if (error && !mostrarFormulario)
    return (
      <p className="text-red-600 text-center text-lg mt-10">Error: {error}</p>
    );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[var(--primary)] text-center">
        Gestión de Cursos y Servicios
      </h2>

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
