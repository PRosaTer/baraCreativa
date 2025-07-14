"use client";

import React, { useState } from "react";
import { Usuario } from "@/app/types/auth";
import MenuLateral from "./MenuLateral";
import PerfilUsuarioEditable from "./PerfilUsuario";
import CursosUsuario from "./CursosUsuario";
import CertificadosUsuario from "@/components/DashboardUsuario/CertificadosUsuario";

interface Props {
  usuario: Usuario;
}

export default function DashboardUsuario({ usuario }: Props) {
  const [vista, setVista] = useState<"perfil" | "cursos" | "logros" | "certificados">("perfil");
  const [usuarioActualizado, setUsuarioActualizado] = React.useState(usuario);

  return (
    <div className="flex min-h-screen gap-4 bg-gray-50 p-6">
      <MenuLateral seleccionarVista={setVista} vistaActual={vista} nombreUsuario={usuario.nombreCompleto} />

      <section className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-auto">
        {vista === "perfil" && (
          <PerfilUsuarioEditable usuario={usuarioActualizado} onActualizar={setUsuarioActualizado} />
        )}
        {vista === "cursos" && <CursosUsuario />}
        {vista === "logros" && (
          <div className="text-center text-gray-600 text-xl font-semibold py-20">
            Aquí van tus logros (a implementar)
          </div>
        )}
        {vista === "certificados" && (
          <CertificadosUsuario />
        )}
      </section>
    </div>
  );
}
