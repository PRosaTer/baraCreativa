import React from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  cursos: Curso[];
  onEditar: (curso: Curso) => void;
}

const TablaCursosAdmin: React.FC<Props> = ({ cursos, onEditar }) => {
  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th className="p-2 border-r border-gray-300">ID</th>
          <th className="p-2 border-r border-gray-300">Título</th>
          <th className="p-2 border-r border-gray-300">Tipo</th>
          <th className="p-2 border-r border-gray-300">Categoría</th>
          <th className="p-2 border-r border-gray-300">Duración (hs)</th>
          <th className="p-2 border-r border-gray-300">Precio</th>
          <th className="p-2 border-r border-gray-300">Modalidad</th>
          <th className="p-2 border-r border-gray-300">Certificado</th>
          <th className="p-2 border-r border-gray-300">Badge</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cursos.length === 0 && (
          <tr>
            <td colSpan={10} className="text-center p-4 text-gray-500">
              No hay cursos para mostrar.
            </td>
          </tr>
        )}

        {cursos.map((curso) => (
          <tr
            key={curso.id}
            className="text-center border-t border-gray-300 hover:bg-yellow-50 cursor-pointer"
          >
            <td className="p-2 border-r border-gray-300">{curso.id}</td>
            <td className="p-2 border-r border-gray-300">{curso.titulo}</td>
            <td className="p-2 border-r border-gray-300">{curso.tipo}</td>
            <td className="p-2 border-r border-gray-300">{curso.categoria}</td>
            <td className="p-2 border-r border-gray-300">{curso.duracionHoras}</td>
            <td className="p-2 border-r border-gray-300">
              ${curso.precio ? Number(curso.precio).toFixed(2) : '0.00'}
            </td>
            <td className="p-2 border-r border-gray-300">{curso.modalidad}</td>
            <td className="p-2 border-r border-gray-300">
              {curso.certificadoDisponible ? 'Sí' : 'No'}
            </td>
            <td className="p-2 border-r border-gray-300">
              {curso.badgeDisponible ? 'Sí' : 'No'}
            </td>
            <td className="p-2">
              <button
                onClick={() => onEditar(curso)}
                className="px-3 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
              >
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaCursosAdmin;
