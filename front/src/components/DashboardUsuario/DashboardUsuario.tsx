"use client";

import React, { useState, useEffect } from "react";
import { Usuario } from "@/app/types/auth";
import MenuLateral from "./MenuLateral";
import PerfilUsuarioEditable from "./PerfilUsuario";
import CursosUsuario from "./CursosUsuario";
import CertificadosUsuario from "@/components/DashboardUsuario/CertificadosUsuario";
import BadgeCAT from "./BadgeCAT";
import { useCatBadgeStatus } from "@/app/hooks/BadgeStatus/useCatBadgeStatus";

interface Props {
  usuario: Usuario;
}

export default function DashboardUsuario({ usuario }: Props) {
  const [vista, setVista] = useState<
    "perfil" | "cursos" | "logros" | "certificados"
  >("perfil");
  const [usuarioActualizado, setUsuarioActualizado] = React.useState(usuario);
  const { status, loading, error } = useCatBadgeStatus(usuario.id);

  return (
    <div className="flex min-h-screen gap-4 bg-gray-50 p-6">
      <MenuLateral
        seleccionarVista={setVista}
        vistaActual={vista}
        nombreUsuario={usuario.nombreCompleto}
      />

      <section className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-auto">
        {vista === "perfil" && (
          <PerfilUsuarioEditable
            usuario={usuarioActualizado}
            onActualizar={setUsuarioActualizado}
          />
        )}
        {vista === "cursos" && <CursosUsuario />}
        {vista === "logros" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && (
              <p className="text-center text-gray-600 col-span-full">
                Cargando logros...
              </p>
            )}
            {error && (
              <p className="text-center text-red-500 col-span-full">
                Error: {error}
              </p>
            )}
            {status && (
              <BadgeCAT
                estaDesbloqueado={status.unlocked}
                mensaje={status.message}
              />
            )}
            {!loading && !status && !error && (
              <p className="text-center text-gray-600 col-span-full">
                No se encontraron logros.
              </p>
            )}
          </div>
        )}
        {vista === "certificados" && <CertificadosUsuario />}
      </section>
    </div>
  );
}
