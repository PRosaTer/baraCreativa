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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-teal-900 overflow-hidden">
      <div className="flex w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
        {/* Imagen a la izquierda con bombillo */}
        <div
          className="w-1/2 bg-cover bg-center bg-gray-950"
          style={{ backgroundImage: 'url("/bombillo-blanco.png")' }}
        ></div>

        {/* Formulario a la derecha */}
        <div className="w-1/2 bg-gray-900 p-8 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)] animate-pulse">
            Inicia sesión
          </h2>

          <CampoEntrada
            etiqueta="Correo electrónico"
            tipo="email"
            nombre="correo"
            valor={correo}
            onChange={(e) => setCorreo(e.target.value)}
            requerido
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-yellow-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
          />

          <CampoContrasena
            etiqueta="Contraseña"
            nombre="contrasena"
            valor={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            requerido
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-yellow-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02] pr-10 relative"
          />

          <div className="text-sm text-right text-yellow-300">
            <EnlaceFormulario
              texto="¿Olvidaste la contraseña?"
              href="/password"
              className="hover:underline"
            />
          </div>

          <BotonEnviar
            texto="Ingresar"
            className="w-full bg-indigo-900 text-yellow-300 py-3 rounded hover:bg-yellow-500 hover:text-indigo-900 transition"
          />

          <div className="text-sm text-center mt-6 text-yellow-300">
            ¿No tienes una cuenta?{" "}
            <EnlaceFormulario
              texto="Regístrate"
              href="/registro"
              className="hover:underline"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
