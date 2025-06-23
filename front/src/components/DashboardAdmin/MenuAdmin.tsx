import React from 'react';

interface Props {
  seleccionarVista: (vista: 'usuarios' | 'cursos' | 'agregarUsuario') => void;
}

export default function MenuAdmin({ seleccionarVista }: Props) {
  return (
    <nav className="w-48 bg-gray-100 p-4 flex flex-col space-y-4">
      <button
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => seleccionarVista('usuarios')}
      >
        Usuarios
      </button>
      <button
        className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => seleccionarVista('cursos')}
      >
        Listado de Cursos
      </button>
      <button
        className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700"
        onClick={() => seleccionarVista('agregarUsuario')}
      >
        Agregar nuevo usuario
      </button>
    </nav>
  );
}
