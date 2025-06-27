import React from 'react';
import { Curso } from '@/app/types/curso'; 

interface Props {
  cursos: Curso[];
  onEditar: (curso: Curso) => void;
  onEliminar: (id: number) => void;
}

const TablaCursosAdmin: React.FC<Props> = ({ cursos, onEditar, onEliminar }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200 text-center text-gray-700 uppercase text-sm leading-normal">
            <th className="p-3 border-r border-gray-300">ID</th>
            <th className="p-3 border-r border-gray-300">Título</th>
            <th className="p-3 border-r border-gray-300">Tipo</th>
            <th className="p-3 border-r border-gray-300">Categoría</th>
            <th className="p-3 border-r border-gray-300">Duración (hs)</th>
            <th className="p-3 border-r border-gray-300">Precio</th>
            <th className="p-3 border-r border-gray-300">Modalidad</th>
            <th className="p-3 border-r border-gray-300">Certificado</th>
            <th className="p-3 border-r border-gray-300">Badge</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {cursos.map((curso) => (
            <tr
              key={curso.id}
              className="border-b border-gray-200 hover:bg-yellow-50 transition-colors duration-150"
            >
              <td className="p-3 text-center border-r border-gray-300">{curso.id}</td>
              <td className="p-3 border-r border-gray-300">{curso.titulo}</td>
              <td className="p-3 border-r border-gray-300">{curso.tipo}</td>
              <td className="p-3 border-r border-gray-300">{curso.categoria}</td>
              <td className="p-3 text-center border-r border-gray-300">{curso.duracionHoras}</td>
              <td className="p-3 text-center border-r border-gray-300">
                ${Number(curso.precio).toFixed(2)}
              </td>
              <td className="p-3 text-center border-r border-gray-300">{curso.modalidad}</td>
              <td className="p-3 text-center border-r border-gray-300">
                {curso.certificadoDisponible ? 'Sí' : 'No'}
              </td>
              <td className="p-3 text-center border-r border-gray-300">
                {curso.badgeDisponible ? 'Sí' : 'No'}
              </td>
              <td className="p-3 text-center">
                <div className="flex item-center justify-center space-x-2">
                  <button
                    onClick={() => onEditar(curso)}
                    className="px-3 py-1 rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(curso.id)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCursosAdmin;