'use client';

import React, { useState, useEffect } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoMultiStep from './EditarCursos/CursoMultiStep/CrearCursoMultiStep';
import EditarCursoAdmin from '../DashboardAdmin/EditarCursos/EditarCursoAdmin';
import { Curso } from '@/app/types/curso';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormularioCreacion, setMostrarFormularioCreacion] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const fetchCursos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/cursos');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al cargar cursos');
      }
      const data: Curso[] = await res.json();
      setCursos(data);
      setMensajeError('');
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(`Error cargando cursos: ${error.message}`);
      } else {
        setMensajeError('Error cargando cursos: Error desconocido');
      }
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursoById = async (id: number): Promise<Curso | null> => {
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error obteniendo curso');
      }
      const data: Curso = await res.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(`Error obteniendo curso actualizado: ${error.message}`);
      } else {
        setMensajeError('Error obteniendo curso actualizado: Error desconocido.');
      }
      return null;
    }
  };

  const handleCursoGuardado = async (cursoGuardado: Curso) => {
    setMensajeExito('');
    setMensajeError('');

    const cursoActualizado = await fetchCursoById(cursoGuardado.id);

    if (cursoActualizado) {
      if (!cursoEditando) {
        setCursos(prev => [...prev, cursoActualizado]);
        setMensajeExito('Curso creado exitosamente');
        setMostrarFormularioCreacion(false);
      } else {
        setCursos(prev => prev.map(c => (c.id === cursoActualizado.id ? cursoActualizado : c)));
        setMensajeExito('Curso actualizado exitosamente');
        setCursoEditando(null);
      }
    } else {
      setMensajeError('Error al obtener el curso actualizado después de guardar.');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este curso?')) return;
    setMensajeExito('');
    setMensajeError('');

    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error eliminando curso');
      }
      setCursos(prev => prev.filter(c => c.id !== id));
      setMensajeExito('Curso eliminado exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(`Error eliminando curso: ${error.message}`);
      } else {
        setMensajeError('Error eliminando curso: Error desconocido');
      }
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormularioCreacion(false);
    setCursoEditando(null);
    setMensajeExito('');
    setMensajeError('');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">Gestión de Cursos y Servicios</h2>
      {mensajeExito && <p className="text-green-600 mb-4">{mensajeExito}</p>}
      {mensajeError && <p className="text-red-600 mb-4">{mensajeError}</p>}
      {!mostrarFormularioCreacion && !cursoEditando && (
        <>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMostrarFormularioCreacion(true);
                setMensajeExito('');
                setMensajeError('');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Crear Nuevo Curso
            </button>
          </div>
          <TablaCursosAdmin cursos={cursos} onEditar={setCursoEditando} onEliminar={handleEliminar} />
        </>
      )}
      {mostrarFormularioCreacion && (
        <CrearCursoMultiStep onGuardar={handleCursoGuardado} onCancelar={handleCancelarFormulario} />
      )}
      {cursoEditando && (
        <EditarCursoAdmin curso={cursoEditando} onGuardar={handleCursoGuardado} onCancelar={handleCancelarFormulario} />
      )}
    </div>
  );
}
