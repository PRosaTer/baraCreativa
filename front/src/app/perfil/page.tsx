"use client";

import React from "react";
import { usePerfilUsuario } from "@/app/hooks/perfil/usePerfilUsuario";
import ErrorNoAutorizado from "@/components/ErrorLogin/ErrorNoAutorizado";
import VistaAdmin from "@/components/DashboardAdmin/VistaAdmin";
import DashboardUsuario from "@/components/DashboardUsuario/DashboardUsuario";

export default function PerfilPage() {
  const { usuario, mensajeError } = usePerfilUsuario();

  if (mensajeError) {
    return <ErrorNoAutorizado mensaje={mensajeError} />;
  }

  if (!usuario) {
    return <p className="p-4">Cargando...</p>;
  }

  if (usuario.esAdmin) {
    return <VistaAdmin />;
  }

  return <DashboardUsuario usuario={usuario} />;
}
