"use client";

import React from "react";
import EditarUsuarioAdmin from "../EditarUsuarios/EditarUsuarioAdmin";
import { Usuario } from "@/types/auth";

interface Props {
  usuarioEditando: Usuario | null;
  cerrarEditor: () => void;
  actualizarUsuarioEnLista: (usuario: Usuario) => void;
  onExitoEdicion?: (mensaje: string) => void; 
}

export default function ModalEditarUsuarioWrapper({
  usuarioEditando,
  cerrarEditor,
  actualizarUsuarioEnLista,
  onExitoEdicion,
}: Props) {
  if (!usuarioEditando) return null;

 
  const manejarActualizacionExitosa = (usuario: Usuario) => {
    actualizarUsuarioEnLista(usuario);
    if (onExitoEdicion) {
      onExitoEdicion("Usuario actualizado correctamente 🚀");
    }
    cerrarEditor();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
        <EditarUsuarioAdmin
          usuario={usuarioEditando}
          onCerrar={cerrarEditor}
          onActualizar={manejarActualizacionExitosa}
        />
      </div>
    </div>
  );
}
