"use client";

import React from 'react';
import { Usuario } from '@/types/auth';

interface Props {
  telefono: string;
  tipoUsuario: Usuario['tipoUsuario'];
  nombreCompleto: string;
  correoElectronico: string;
  setTelefono: (val: string) => void;
  setTipoUsuario: (val: Usuario['tipoUsuario']) => void;
  setNombreCompleto: (val: string) => void;
  telefonoRef: React.RefObject<HTMLInputElement>;
  handleKeyDownNombre: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleKeyDownTelefono: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function CamposEditarUsuarioAdmin({
  telefono,
  tipoUsuario,
  nombreCompleto,
  correoElectronico,
  setTelefono,
  setTipoUsuario,
  setNombreCompleto,
  telefonoRef,
  handleKeyDownNombre,
  handleKeyDownTelefono,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">Nombre Completo:</label>
      <input
        type="text"
        value={nombreCompleto}
        onChange={(e) => setNombreCompleto(e.target.value)}
        onKeyDown={handleKeyDownNombre}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
      />

      <label className="block text-gray-700 font-medium">Teléfono:</label>
      <input
        type="text"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        onKeyDown={handleKeyDownTelefono}
        ref={telefonoRef}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
      />

      <label className="block text-gray-700 font-medium">Tipo de Usuario:</label>
      <select
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value as Usuario['tipoUsuario'])}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-yellow-400"
      >
        <option value="Alumno">Alumno</option>
        <option value="Instructor">Instructor</option>
        <option value="Empresa">Empresa</option>
        <option value="Admin">Admin</option>
      </select>

      <label className="block text-gray-700 font-medium">Correo Electrónico:</label>
      <input
        type="email"
        value={correoElectronico}
        readOnly
        className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
      />
    </div>
  );
}
