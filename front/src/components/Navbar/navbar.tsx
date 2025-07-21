"use client";

import React, { useEffect, useState, useRef } from "react";
import Logo from "../logo";
import ComunidadButton from "../Botones/sobre-nosotros";
import SobreComunidadButton from "../Botones/comunidad";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import { useAuth } from "@/app/context/AuthContext";
import BotonConEfecto from "../Botones/BotonConEfecto";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Toggle menu on image click
  const toggleProfileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="w-full bg-primary py-2 md:py-4 relative z-30">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 lg:px-20 gap-x-[54px]">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(false)} // optionally close profile menu on hamburger toggle
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

        <div
          className={`flex flex-col md:flex-row items-center justify-start w-full gap-x-[1em]
            md:flex
            absolute md:static top-[100%] left-0  bg-primary
            p-4 md:p-0 z-20
            border-t border-white/10 md:border-0
            max-w-screen-md
            max-h-full
            overflow-visible
            mx-auto
            rounded-b-lg
            shadow-lg`}
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
            <div className="relative z-50" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="relative w-16 h-16 rounded-full overflow-hidden z-10 border-2 border-white"
              >
                {usuario.fotoPerfil ? (
                  <img
                    src={`http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}`}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
                    ?
                  </div>
                )}
                {/* Efectos amarillos animados */}
                <span className="absolute bg-yellow-300 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-10 -top-16 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                <span className="absolute bg-yellow-500 w-36 h-36 -left-10 -top-16 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
              </button>

              {/* Menú desplegable */}
              <div
                className={`absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50
                  flex flex-col items-center
                  transition-opacity duration-300 ease-out
                  ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <button
                  onClick={() => {
                    router.push("/perfil");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 font-medium hover:text-cyan-600 transition-colors duration-200"
                >
                  Perfil
                </button>
                <button
                  onClick={() => {
                    cerrarSesion();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium hover:text-red-700 transition-colors duration-200"
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
