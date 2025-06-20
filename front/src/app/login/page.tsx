"use client";

import React, { useEffect } from "react";
import ContenedorFormulario from "@/components/formularios/ContenedorFormulario";
import CampoEntrada from "@/components/formularios/CampoEntrada";
import CampoContrasena from "@/components/formularios/CampoContrasena";
import BotonEnviar from "@/components/formularios/BotonEnviar";
import EnlaceFormulario from "@/components/formularios/EnlaceFormulario";
import { useAutenticacion } from "@/app/hooks/usarAutenticacion";

const InicioSesion: React.FC = () => {
  const {
    datosInicioSesion,
    manejarCambio,
    manejarInicioSesion: iniciarSesionHook,
    usuario
  } = useAutenticacion();

  const manejarInicioSesion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("LOGIN_PAGE: manejarInicioSesion - Llamando a iniciarSesionHook.");
    const exito = await iniciarSesionHook(e);
    if (exito) {
      console.log("LOGIN_PAGE: manejarInicioSesion - Inicio de sesión exitoso. Redirección manejada por el hook.");
    } else {
      console.log("LOGIN_PAGE: manejarInicioSesion - Inicio de sesión fallido.");
    }
  };

  useEffect(() => {
    console.log("LOGIN_PAGE: useEffect - Estado actual del usuario:", usuario);
  }, [usuario]);

  return (
    <>
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