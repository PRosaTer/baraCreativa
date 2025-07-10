"use client";

import React from "react";

interface Props {
  seleccionarVista: (vista: "perfil" | "cursos" | "logros" | "certificados") => void;
  vistaActual: string;
  nombreUsuario: string;
}

export default function MenuUsuario({ seleccionarVista, vistaActual, nombreUsuario }: Props) {
  return (
    <nav className="w-48 bg-gray-100 p-4 flex flex-col space-y-4 select-none">
      <input
        value={nombreUsuario}
        disabled
        className="py-2 px-4 rounded bg-yellow-300 text-white font-semibold text-center cursor-default"
      />

      <button
        className={`py-2 px-4 rounded text-white font-semibold transition ${
          vistaActual === "perfil" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => seleccionarVista("perfil")}
      >
        Mi Perfil
      </button>

      <button
        className={`py-2 px-4 rounded text-white font-semibold transition ${
          vistaActual === "cursos" ? "bg-green-600" : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={() => seleccionarVista("cursos")}
      >
        Mis Cursos
      </button>

      <button
        className={`py-2 px-4 rounded text-white font-semibold transition ${
          vistaActual === "logros" ? "bg-purple-600" : "bg-purple-500 hover:bg-purple-600"
        }`}
        onClick={() => seleccionarVista("logros")}
      >
        Mis Logros
      </button>

      <button
        className={`py-2 px-4 rounded text-white font-semibold transition ${
          vistaActual === "certificados" ? "bg-pink-600" : "bg-pink-500 hover:bg-pink-600"
        }`}
        onClick={() => seleccionarVista("certificados")}
      >
        Mis Certificados
      </button>
    </nav>
  );
}
