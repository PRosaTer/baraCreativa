'use client';

import React from "react";
import { Usuario } from "@/types/auth";

interface Props {
  usuario: Usuario;
}

export default function InfoCuenta({ usuario }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 text-yellow-400 font-semibold tracking-wide select-text">
      <p>
        <span className="opacity-80">Tipo de Usuario:</span> {usuario.tipoUsuario}
      </p>
      <p>
        <span className="opacity-80">Estado de Cuenta:</span> {usuario.estadoCuenta}
      </p>
      <p>
        <span className="opacity-80">Última sesión:</span>{" "}
        {usuario.ultimaSesion ? new Date(usuario.ultimaSesion).toLocaleString() : "-"}
      </p>
      <p>
        <span className="opacity-80">Administrador:</span> {usuario.esAdmin ? "Sí" : "No"}
      </p>
    </div>
  );
}
