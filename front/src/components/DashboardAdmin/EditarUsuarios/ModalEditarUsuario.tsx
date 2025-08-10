"use client";

import React from "react";
import { Usuario } from "../../../app/types/auth";
import useEditarUsuarioForm from "../../../app/hooks/EditarUsuarioAdmin/useEditarUsuarioForm";
import FotoPerfil from "./FotoPerfil";
import CampoInput from "./CampoInput";
import CampoSelect from "./CampoSelect";

interface Props {
  usuario: Usuario | null;
  onClose: () => void;
  onGuardar: (usuarioEditado: Usuario) => void;
}

export default function ModalEditarUsuario({ usuario, onClose, onGuardar }: Props) {
  const { form, handleChange } = useEditarUsuarioForm(usuario);

  if (!form) return null;

  const handleSubmit = () => {
    onGuardar(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px] max-w-full">
        <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

        <FotoPerfil fotoPerfil={form.fotoPerfil} nombre={form.nombreCompleto} />

        <CampoInput label="Nombre" name="nombreCompleto" value={form.nombreCompleto} onChange={handleChange} />

        <CampoInput label="Correo" name="correoElectronico" value={form.correoElectronico} onChange={handleChange} />

        <CampoInput label="Teléfono" name="telefono" value={form.telefono || ""} onChange={handleChange} />

        <CampoSelect
          label="Tipo Usuario"
          name="tipoUsuario"
          value={form.tipoUsuario || ""}
          onChange={handleChange}
          options={["Alumno", "Instructor", "Admin"]}
          placeholder="Escoje una opción"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={() => { handleSubmit(); onClose(); }} className="px-4 py-1 bg-blue-500 text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
