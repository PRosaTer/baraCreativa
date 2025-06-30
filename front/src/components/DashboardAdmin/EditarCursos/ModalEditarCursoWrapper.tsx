"use client";

import React from "react";
import EditarCursoAdmin from "./EditarCursoAdmin";
import { Curso } from "@/app/types/curso";

interface Props {
  cursoEditando: Curso | null;
  cerrarEditor: () => void;
  actualizarCursoEnLista: (curso: Curso) => Promise<void>;
}

export default function ModalEditarCursoWrapper({ cursoEditando, cerrarEditor, actualizarCursoEnLista }: Props) {
  if (!cursoEditando) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
        <EditarCursoAdmin
          curso={cursoEditando}
          onGuardar={actualizarCursoEnLista}
          onCancelar={cerrarEditor}
        />
      </div>
    </div>
  );
}
