"use client";

import React, { useEffect, useState } from "react";
import Logo from "../logo";
import ComunidadButton from "../Botones/sobre-nosotros";
import SobreComunidadButton from "../Botones/comunidad";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import { useAuth } from "@/app/context/AuthContext";
import BotonConEfecto from "../Botones/BotonConEfecto";

export default function Navbar() {
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    console.log("NAVBAR - Usuario:", usuario);
    console.log("NAVBAR - CargandoUsuario:", cargandoUsuario);
  }, [usuario, cargandoUsuario]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-primary py-2 md:py-4 relative z-30">
      <div
        className="flex items-center justify-between
          w-full max-w-screen-xl mx-auto
          px-2 sm:px-4 md:px-8 lg:px-20
          gap-x-[54px]"
      >
        {/* Logo y botón hamburguesa */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          {/* Botón hamburguesa visible hasta md */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Menú principal */}
        <div
          className={`
            flex flex-col md:flex-row items-center justify-start w-full gap-x-[1em]
            ${isMenuOpen ? "flex" : "hidden"} md:flex
            absolute md:static top-[100%] left-0 w-full bg-primary
            p-4 md:p-0 z-20
            border-t border-white/10 md:border-0

            max-w-screen-md
            max-h-[70vh]
            overflow-auto
            mx-auto
            rounded-b-lg
            shadow-lg
          `}
        >
          <SobreComunidadButton />
          <ComunidadButton />
          <BarraBusqueda className="flex-grow min-w-[200px] max-w-[656px] md:max-w-[400px] lg:max-w-[656px]" />
          <Cursos />
          <Contactenos />

          {cargandoUsuario ? (
            <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap">
              Cargando...
            </div>
          ) : usuario ? (
            <div className="relative group">
              <BotonConEfecto
                texto={`Hola, ${usuario.nombreCompleto.split(" ")[0]}`}
                href="/perfil"
              />
              <div
                className="absolute right-0 top-full w-fit bg-white rounded-md shadow-lg py-1 z-10
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-opacity duration-700 ease-out
                  flex flex-col items-center"
              >
                <button
                  onClick={cerrarSesion}
                  className="px-8 py-2 text-sm whitespace-nowrap
                    bg-gray-800 text-gray-200 font-bold rounded-lg shadow-sm border border-transparent
                    hover:bg-gray-700 hover:text-cyan-400 hover:shadow-md hover:shadow-cyan-500/30 hover:border-cyan-400
                    transition-all duration-300 ease-in-out"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <BotonConEfecto texto="Acceso" href="/login" />
          )}
        </div>
      </div>
    </nav>
  );
}
