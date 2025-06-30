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
      if (!res.ok) throw new Error('Error al cargar cursos');
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      alert('Error cargando cursos');
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleCursoCreado = async () => {
    await fetchCursos();
    setMostrarFormulario(false);
    setMensajeExito("Curso creado exitosamente");
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este curso?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando curso');
      setCursos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      alert('Error eliminando curso');
    }
  };

  const handleActualizarCurso = async (cursoActualizado: Curso) => {
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${cursoActualizado.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoActualizado),
      });

      if (!res.ok) throw new Error('Error actualizando curso');

      const data = await res.json();

      setCursos((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      setMensajeExito("Curso actualizado exitosamente");
      setCursoEditando(null);
    } catch (error) {
      alert('Error actualizando curso');
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
          onCursoCreado={handleCursoCreado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {cursoEditando && (
        <EditarCursoAdmin
          curso={cursoEditando}
          onGuardar={handleActualizarCurso}
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
