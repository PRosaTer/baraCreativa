"use client";

import React from "react";
import ContenedorFormularioContacto from "@/components/form-soporte/ContenedorFormularioContacto";
import CampoEntrada from "@/components/form-soporte/campoEntrada";
import CampoSelector from "@/components/form-soporte/CampoMensaje";
import CampoMensaje from "@/components/form-soporte/CampoMensaje";
import BotonEnviar from "@/components/form-soporte/botonEnviar";
import { useSoporte } from "@/app/hooks/usarSoporte";

const Contacto: React.FC = () => {
  const {
    datosContacto,
    usuarioAutenticado,
    cargandoUsuario,
    manejarCambioContacto,
    manejarContacto,
  } = useSoporte();

  const opcionesTipoConsulta = [
    { valor: "Técnica", texto: "Técnica" },
    { valor: "Administrativa", texto: "Administrativa" },
    { valor: "Académica", texto: "Académica" },
  ];

  if (cargandoUsuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <ContenedorFormularioContacto titulo="Contáctenos">
      <form onSubmit={manejarContacto} className="space-y-6">
        <CampoEntrada
          etiqueta="Correo Electrónico"
          tipo="email"
          nombre="correo"
          valor={datosContacto.correo}
          onChange={manejarCambioContacto}
          requerido
          placeholder="Ej: usuario@ejemplo.com"
          disabled={!!usuarioAutenticado} // Deshabilitado si hay usuario logueado
        />
        <CampoSelector
          etiqueta="Tipo de Consulta"
          nombre="tipoConsulta"
          valor={datosContacto.tipoConsulta}
          onChange={manejarCambioContacto}
          opciones={opcionesTipoConsulta}
          requerido
        />
        <CampoMensaje
          etiqueta="Mensaje"
          nombre="mensaje"
          valor={datosContacto.mensaje}
          onChange={manejarCambioContacto}
          requerido
          placeholder="Describe tu consulta aquí..."
        />
        <BotonEnviar texto="Enviar Consulta" />
      </form>
    </ContenedorFormularioContacto>
  );
};

export default Contacto;
