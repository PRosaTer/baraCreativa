"use client";

import React from 'react';
import { Usuario } from '@/app/types/auth';
import useEditarUsuarioAdmin from '@/app/hooks/EditarUsuarioAdmin/useEditarUsuarioAdmin';
import CamposEditarUsuarioAdmin from './CamposEditarUsuarioAdmin';
import FotoPerfilUsuario from './FotoPerfilUsuario';

interface Props {
  usuario: Usuario;
  onCerrar: () => void;
  onActualizar: (actualizado: Usuario) => void;
}

export default function EditarUsuarioAdmin({ usuario, onCerrar, onActualizar }: Props) {
  const {
    telefono,
    tipoUsuario,
    nombreCompleto,
    guardando,
    telefonoRef,
    setTelefono,
    setTipoUsuario,
    setNombreCompleto,
    handleGuardar,
    handleKeyDownNombre,
    handleKeyDownTelefono,
  } = useEditarUsuarioAdmin(usuario, onActualizar, onCerrar);

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-800">Editar Usuario</h2>

      <FotoPerfilUsuario nombre={usuario.nombreCompleto} fotoPerfil={usuario.fotoPerfil} />

      <CamposEditarUsuarioAdmin
        telefono={telefono}
        tipoUsuario={tipoUsuario}
        nombreCompleto={nombreCompleto}
        correoElectronico={usuario.correoElectronico}
        setTelefono={setTelefono}
        setTipoUsuario={setTipoUsuario}
        setNombreCompleto={setNombreCompleto}
        telefonoRef={telefonoRef}
        handleKeyDownNombre={handleKeyDownNombre}
        handleKeyDownTelefono={handleKeyDownTelefono}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <button
          onClick={onCerrar}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition"
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
