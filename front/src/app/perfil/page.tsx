"use client";

import React from "react";
import { usePerfilUsuario } from "@/app/hooks/perfil/usePerfilUsuario";
import ErrorNoAutorizado from "@/components/ErrorLogin/ErrorNoAutorizado";
import VistaAdmin from "@/components/DashboardAdmin/VistaAdmin";
import PerfilUsuarioEditable from "@/components/DashboardUsuario/PerfilUsuario";

export default function PerfilPage() {
  const { usuario, setUsuario, mensajeError } = usePerfilUsuario();

  if (mensajeError) {
    return <ErrorNoAutorizado mensaje={mensajeError} />;
  }

  if (!usuario) {
    return <p className="p-4">Cargando...</p>;
  }

  if (usuario.esAdmin) {
    return <VistaAdmin />;
  }

  return (
    <main className="p-4 bg-white">
      <PerfilUsuarioEditable usuario={usuario} onActualizar={setUsuario} />
    </main>
  );
}
