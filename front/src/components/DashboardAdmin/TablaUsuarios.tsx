import React from 'react';
import { Usuario } from '@/app/types/auth';

interface Props {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
}

const TablaUsuarios: React.FC<Props> = ({ usuarios, onEditar }) => {
  return (
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200 text-center">
          <th className="p-2 border-r border-gray-300">ID</th>
          <th className="p-2 border-r border-gray-300">Nombre</th>
          <th className="p-2 border-r border-gray-300">Email</th>
          <th className="p-2 border-r border-gray-300">Tipo</th>
          <th className="p-2 border-r border-gray-300">Estado</th>
          <th className="p-2">Conectado</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr
            key={u.id}
            className="text-center border-t border-gray-300 cursor-pointer hover:bg-yellow-50"
            onClick={() => onEditar(u)}
          >
            <td className="p-2 border-r border-gray-300">{u.id}</td>
            <td className="p-2 border-r border-gray-300">{u.nombreCompleto}</td>
            <td className="p-2 border-r border-gray-300">{u.correoElectronico}</td>
            <td className="p-2 border-r border-gray-300">{u.tipoUsuario}</td>
            <td className="p-2 border-r border-gray-300">{u.estadoCuenta}</td>
            <td className={`p-2 ${u.estaConectado ? 'text-green-600' : 'text-gray-400'}`}>
              {u.estaConectado ? '🟢 Conectado' : '⚪ Desconectado'}
            </td>
          </tr>
        ))}
        {usuarios.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              No hay usuarios para mostrar.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TablaUsuarios;
