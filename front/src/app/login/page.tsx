"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ContenedorFormulario from "@/components/formularios/ContenedorFormulario";
import CampoEntrada from "@/components/formularios/CampoEntrada";
import CampoContrasena from "@/components/formularios/CampoContrasena";
import BotonEnviar from "@/components/formularios/BotonEnviar";
import EnlaceFormulario from "@/components/formularios/EnlaceFormulario";
import { useAutenticacion } from "@/app/hooks/usarAutenticacion";
import MensajeAviso from "@/components/Aviso/MensajeAviso";

const InicioSesion: React.FC = () => {
  const router = useRouter();
  const [mostrarVentana, setMostrarVentana] = useState(true);
  const {
    datosInicioSesion,
    manejarCambio,
    manejarInicioSesion: iniciarSesionHook,
    mensajeExito,
    setMensajeExito,
  } = useAutenticacion();

  const manejarInicioSesion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const exito = await iniciarSesionHook(e);
    if (exito) {
      setMensajeExito(true);
      setTimeout(() => {
        setMostrarVentana(false);
        setTimeout(() => router.push("/"), 800); 
      }, 1500);
    }
  };

  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoRecuperacion");
    if (correoGuardado) {
      manejarCambio({
        target: {
          name: "correo",
          value: correoGuardado,
        },
      } as React.ChangeEvent<HTMLInputElement>);
      localStorage.removeItem("correoRecuperacion");
    }
  }, [manejarCambio]);

  return (
    <>
      {mensajeExito && (
        <MensajeAviso
          mensaje="Bienvenido"
          onCerrar={() => setMensajeExito(false)}
          duracion={2000}
        />
      )}

      <AnimatePresence>
        {mostrarVentana && (
          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InicioSesion;
