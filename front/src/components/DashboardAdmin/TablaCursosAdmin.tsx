import React from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  cursos: Curso[];
  onEditar: (curso: Curso) => void;
  onEliminar: (id: number) => void;
  onSubirArchivo?: (cursoId: number, archivo: File, tipo: 'scorm' | 'video' | 'pdf') => Promise<any>;
}

export default function TablaCursosAdmin({ cursos, onEditar, onEliminar, onSubirArchivo }: Props) {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Título</th>
          <th className="border border-gray-300 px-4 py-2">Imagen</th>
          <th className="border border-gray-300 px-4 py-2">Precio</th>
          <th className="border border-gray-300 px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cursos.map((curso) => (
          <tr key={curso.id} className="text-center">
            <td className="border border-gray-300 px-4 py-2">{curso.id}</td>
            <td className="border border-gray-300 px-4 py-2">{curso.titulo}</td>
            <td className="border border-gray-300 px-4 py-2">
              {curso.imagenCurso ? (
                <img
                  src={`http://localhost:3001/uploads/imagenes-cursos/${curso.imagenCurso}`}
                  alt={`Imagen del curso ${curso.titulo}`}
                  className="w-24 h-auto rounded"
                />
              ) : (
                <span>Sin imagen</span>
              )}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              ${typeof curso.precio === 'number' ? curso.precio.toFixed(2) : Number(curso.precio).toFixed(2)}
            </td>
            <td className="border border-gray-300 px-4 py-2 space-x-2">
              <button
                onClick={() => onEditar(curso)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(curso.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
