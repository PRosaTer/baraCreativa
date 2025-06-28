"use client";

import React from "react";
import FormularioReset from "@/components/Reset/FormularioReset";
import DecoracionesFuturistas from "@/components/Reset/DecoracionesFuturistas";
import { useResetPassword } from "@/app/hooks/reset/useResetPassword";

const SolicitarResetPage: React.FC = () => {
  const {
    correo,
    setCorreo,
    mensaje,
    error,
    manejarSubmit,
  } = useResetPassword();

  return (
    <div className="h-[800px] md:h-[691px] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md animate-fade-in z-10">
        <h1 className="text-3xl font-extrabold text-cyan-400 text-center mb-6 tracking-wide uppercase">
          Recuperar Contraseña
        </h1>
        <FormularioReset
          correo={correo}
          setCorreo={setCorreo}
          manejarSubmit={manejarSubmit}
          mensaje={mensaje}
          error={error}
        />
      </div>
      <DecoracionesFuturistas />
    </div>
  );
};

export default SolicitarResetPage;
