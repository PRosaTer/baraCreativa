"use client";

import React from "react";
import ContenedorFormulario from "@/components/formularios/ContenedorFormulario";
import CampoEntrada from "@/components/formularios/CampoEntrada";
import CampoContrasena from "@/components/formularios/CampoContrasena";
import BotonEnviar from "@/components/formularios/BotonEnviar";
import EnlaceFormulario from "@/components/formularios/EnlaceFormulario";
import { useAutenticacion } from "@/app/hooks/usarAutenticacion";
import MensajeAviso from "@/components/Aviso/MensajeAviso";

const InicioSesion: React.FC = () => {
  const { datosInicioSesion, manejarCambio, manejarInicioSesion, mensajeExito, setMensajeExito } =
    useAutenticacion();

  return (
    <>
      {mensajeExito && (
        <MensajeAviso
          mensaje="Bienvenido"
          onCerrar={() => setMensajeExito(false)}
          duracion={2000}
        />
      )}

      <ContenedorFormulario titulo="Inicia sesión">
        <form onSubmit={manejarInicioSesion} className="space-y-6">
          <CampoEntrada
            etiqueta="Correo electrónico"
            tipo="email"
            nombre="correo"
            valor={datosInicioSesion.correo}
            onChange={manejarCambio}
            requerido
          />
          <CampoContrasena
            etiqueta="Contraseña"
            nombre="contrasena"
            valor={datosInicioSesion.contrasena}
            onChange={manejarCambio}
            requerido
          />
          <div className="text-sm text-right">
            <EnlaceFormulario texto="¿Olvidaste la contraseña?" href="/password" />
          </div>
          <BotonEnviar texto="Ingresar" />
        </form>
        <div className="text-sm text-center mt-6 text-gray-600">
          ¿No tienes una cuenta? <EnlaceFormulario texto="Regístrate" href="/registro" />
        </div>
      </ContenedorFormulario>
    </>
  );
};

export default InicioSesion;
