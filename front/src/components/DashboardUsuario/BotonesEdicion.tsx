'use client';

import React from "react";

interface Props {
  editando: boolean;
  guardando: boolean;
  onCancelar: () => void;
}

export default function BotonesEdicion({ editando, guardando, onCancelar }: Props) {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {editando && (
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="px-6 py-2 rounded-3xl font-semibold bg-gray-700 hover:bg-gray-600 text-yellow-400 transition"
        >
          Cancelar
        </button>
      )}

      <button
        type="submit"
        disabled={guardando}
        className={`relative inline-block px-8 py-3 font-extrabold tracking-wide text-black rounded-3xl
          bg-gradient-to-r from-red-500 to-yellow-400 shadow-lg shadow-yellow-400/70
          transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110
          hover:bg-gradient-to-r hover:from-yellow-400 hover:to-red-500 disabled:opacity-60 disabled:cursor-not-allowed
          overflow-visible select-none ring-2 ring-yellow-400 focus-visible:ring-yellow-300 focus-visible:outline-none`}
      >
        <span className="relative z-10 flex items-center justify-center">
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Editar"}
        </span>

        <span className="absolute border-dot"></span>
      </button>
    </div>
  );
}
