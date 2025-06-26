"use client";

import React, { useState } from "react";
import ContenedorFormulario from "@/components/formularios/ContenedorFormulario";
import CampoEntrada from "@/components/formularios/CampoEntrada";
import CampoContrasena from "@/components/formularios/CampoContrasena";
import BotonEnviar from "@/components/formularios/BotonEnviar";
import EnlaceFormulario from "@/components/formularios/EnlaceFormulario";
import { useAuth } from "@/app/context/AuthContext";

const InicioSesion: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const { manejarInicioSesion } = useAuth();

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const exito = await manejarInicioSesion(e, correo, contrasena);
    if (exito) {
      console.log("Login exitoso.");
    }
  };

  return (
    <ContenedorFormulario titulo="Inicia sesión">
      <form onSubmit={manejarSubmit} className="space-y-6">
        <CampoEntrada
          etiqueta="Correo electrónico"
          tipo="email"
          nombre="correo"
          valor={correo}
          onChange={(e) => setCorreo(e.target.value)}
          requerido
        />
        <CampoContrasena
          etiqueta="Contraseña"
          nombre="contrasena"
          valor={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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
  );
};

export default InicioSesion;
