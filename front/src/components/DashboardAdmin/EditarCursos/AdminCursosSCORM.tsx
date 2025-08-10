'use client';

import React, { useEffect, useState } from 'react';
import ModalEditarCursoWrapper from './ModalEditarCursoWrapper';
import { Curso } from '@/app/types/curso';

export default function AdminCursosSCORM() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`);
        if (!res.ok) throw new Error('Error cargando cursos');
        const data: Curso[] = await res.json();
        setCursos(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error desconocido al cargar cursos');
        }
      }
    }
    fetchCursos();
  }, []);

  const abrirModalEditar = (curso: Curso) => {
    setCursoEditando(curso);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setCursoEditando(null);
    setModalAbierto(false);
  };

  const actualizarCursoEnLista = async (cursoActualizado: Curso) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoActualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoActualizado),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al actualizar curso');
      setCursos(prev => prev.map(c => (c.id === cursoActualizado.id ? cursoActualizado : c)));
      cerrarModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Error desconocido al actualizar curso');
      }
    }
  };

  const eliminarCurso = async (id: number) => {
    if (!confirm('¿Seguro que querés eliminar este curso?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar curso');
      setCursos(prev => prev.filter(c => c.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Error desconocido al eliminar curso');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administrar Cursos SCORM</h1>

      {cursos.length === 0 ? (
        <p>No hay cursos SCORM cargados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Título</th>
              <th className="border border-gray-300 p-2">Tipo</th>
              <th className="border border-gray-300 p-2">Modalidad</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso => (
              <tr key={curso.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-center">{curso.id}</td>
                <td className="border border-gray-300 p-2">{curso.titulo}</td>
                <td className="border border-gray-300 p-2">{curso.tipo}</td>
                <td className="border border-gray-300 p-2">{curso.modalidad}</td>
                <td className="border border-gray-300 p-2 text-right">${curso.precio}</td>
                <td className="border border-gray-300 p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => abrirModalEditar(curso)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => eliminarCurso(curso.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalAbierto && cursoEditando && (
        <ModalEditarCursoWrapper
          cursoEditando={cursoEditando}
          cerrarEditor={cerrarModal}
          actualizarCursoEnLista={actualizarCursoEnLista}
        />
      )}
    </div>
  );
}
