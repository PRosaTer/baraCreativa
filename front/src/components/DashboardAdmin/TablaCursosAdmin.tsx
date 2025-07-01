import React from 'react';
import { Curso } from '@/app/types/curso'; // Asegúrate de que esta ruta sea correcta

interface Props {
  cursos: Curso[];
  onEditar: (curso: Curso) => void;
  onEliminar: (id: number) => void;
}

export default function TablaCursosAdmin({ cursos, onEditar, onEliminar }: Props) {


  const handleLaunchScorm = (scormPath: string) => {
    if (scormPath) {
      window.open(`http://localhost:3001${scormPath}`, '_blank');
    } else {
      alert('Este curso no tiene un paquete SCORM asociado.');
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCORM</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{curso.titulo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.categoria}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.modalidad}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${curso.precio}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {curso.archivoScorm ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    SCORM Disponible
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    No SCORM
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditar(curso)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(curso.id)}
                  className="text-red-600 hover:text-red-900 mr-3"
                >
                  Eliminar
                </button>
                {curso.archivoScorm && (
                  <button
                    onClick={() => handleLaunchScorm(curso.archivoScorm as string)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Lanzar SCORM
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
