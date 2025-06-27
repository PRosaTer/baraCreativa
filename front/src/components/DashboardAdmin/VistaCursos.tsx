'use client';

import React, { useState, useEffect } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoForm from '../CrearCursoForm/CrearCursoForm';
import { Curso } from '@/app/types/curso';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const handleCursoCreado = async (cursoCreado: Curso) => {
    // Para asegurarnos que tenemos la última info del curso con la imagen, volvemos a traer la lista completa
    await fetchCursos();
    setMostrarFormulario(false);
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">Gestión de Cursos</h2>

      {!mostrarFormulario && (
        <>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="mb-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Crear Nuevo Curso
          </button>
          <TablaCursosAdmin cursos={cursos} onEditar={() => {}} onEliminar={handleEliminar} />
        </>
      )}

      {mostrarFormulario && (
        <CrearCursoForm
          onCursoCreado={handleCursoCreado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
}
