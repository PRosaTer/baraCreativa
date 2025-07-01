'use client';

import React, { useState, useEffect } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoMultiStep from '../CrearCursoForm/CrearCursoMultiStep';
import EditarCursoAdmin from '../DashboardAdmin/EditarCursos/EditarCursoAdmin';
import { Curso } from '@/app/types/curso';
import InlineToast from '@/components/DashboardUsuario/InlineToast';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string>("");

  const fetchCursos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/cursos');
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error al cargar cursos');
      }
      const data: Curso[] = await res.json();
      setCursos(data);
    } catch (error) {
      console.error('Error cargando cursos:', error);
      if (error instanceof Error) {
        setMensajeExito(`Error cargando cursos: ${error.message}`);
      } else {
        setMensajeExito(`Error cargando cursos: Error desconocido`);
      }
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursoById = async (id: number): Promise<Curso | null> => {
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`);
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error obteniendo curso');
      }
      const data: Curso = await res.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo curso actualizado:', error);
      return null;
    }
  };

  const handleCursoGuardado = async (cursoGuardado: Curso) => {
    console.log('Curso recibido en handleCursoGuardado:', cursoGuardado);

    const cursoActualizado = await fetchCursoById(cursoGuardado.id);

    if (cursoActualizado) {
      if (!cursoEditando) {
        setCursos((prev) => [...prev, cursoActualizado]);
        setMensajeExito("Curso creado exitosamente");
        setMostrarFormulario(false);
      } else {
        setCursos((prev) =>
          prev.map((c) => (c.id === cursoActualizado.id ? cursoActualizado : c))
        );
        setMensajeExito("Curso actualizado exitosamente");
        setCursoEditando(null);
      }
    } else {
      setMensajeExito("Error actualizando curso");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este curso?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error eliminando curso');
      }
      setCursos((prev) => prev.filter((c) => c.id !== id));
      setMensajeExito("Curso eliminado exitosamente");
    } catch (error) {
      console.error('Error eliminando curso:', error);
      if (error instanceof Error) {
        setMensajeExito(`Error eliminando curso: ${error.message}`);
      } else {
        setMensajeExito(`Error eliminando curso: Error desconocido`);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">Gestión de Cursos</h2>

      {!mostrarFormulario && !cursoEditando && (
        <>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="mb-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Crear Nuevo Curso
          </button>
          <TablaCursosAdmin
            cursos={cursos}
            onEditar={setCursoEditando}
            onEliminar={handleEliminar}
          />
        </>
      )}

      {mostrarFormulario && (
        <CrearCursoMultiStep
          onCursoCreado={handleCursoGuardado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {cursoEditando && (
        <EditarCursoAdmin
          curso={cursoEditando}
          onGuardar={handleCursoGuardado}
          onCancelar={() => setCursoEditando(null)}
        />
      )}

      {mensajeExito && (
        <InlineToast
          mensaje={mensajeExito}
          onClose={() => setMensajeExito("")}
        />
      )}
    </div>
  );
}
