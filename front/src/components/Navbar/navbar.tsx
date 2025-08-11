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
import Academias from "../Botones/academias";

export default function Navbar() {
  const router = useRouter();
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Función para obtener la URL de la imagen de perfil de forma segura.
  // Esto maneja diferentes formatos de rutas, incluyendo 'null' o 'undefined'.
  const getProfileImageUrl = (fotoPerfil: string | null | undefined) => {
    if (!fotoPerfil) {
      return null;
    }

    // Si la ruta ya es una URL completa (empieza con 'http' o '/'), la usamos directamente.
    // Esto es útil si en producción la base de datos guarda la ruta completa.
    if (fotoPerfil.startsWith('http') || fotoPerfil.startsWith('/')) {
      return fotoPerfil;
    }

    // Si solo es el nombre del archivo, construimos la ruta completa.
    // Esto es útil si en desarrollo la base de datos guarda solo el nombre del archivo.
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${fotoPerfil}`;
  };

  const profileImageUrl = usuario ? getProfileImageUrl(usuario.fotoPerfil) : null;

  return (
    <nav className={`w-full bg-primary mt-[5px] h-[100px] relative z-30 ${isMenuOpen ? "bg-primary/95 backdrop-blur" : ""}`}>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Logo />
          {/* Botón de menú hamburguesa */}
          <button
            className="lg:hidden text-white ml-2 z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                    ? "M6 18L18 6M6 6l12 12" // X icon
                    : "M4 6h16M4 12h16M4 18h16" // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>

        {/* Menú de navegación */}
        <div
          className={`
            ${isMenuOpen ? "flex" : "hidden"}
            lg:flex flex-col lg:flex-row lg:items-center
            w-full lg:w-auto
            fixed lg:static inset-0 lg:inset-auto
            p-6 lg:p-0
            bg-primary/95 lg:bg-transparent backdrop-blur
            z-40
            transition-all duration-300 ease-in-out
            overflow-y-auto lg:overflow-visible
          `}
        >
          {/* Contenedor para los elementos del menú en desktop */}
          <div className="flex flex-row items-center w-full lg:w-auto gap-4 lg:gap-6">
            {/* Solo visible en pantallas grandes */}
            <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
              <SobreComunidadButton />
              <ComunidadButton />
              <Academias />
            </div>

            {/* Barra de búsqueda para escritorio, oculta en móvil */}
            <BarraBusqueda className="hidden lg:flex flex-grow min-w-[200px] max-w-[656px] lg:max-w-[400px] xl:max-w-[656px]" />

            {/* Solo visible en pantallas grandes */}
            <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
              <Cursos />
              <Contactenos />
            </div>
          </div>

          {/* Menú de hamburguesa para móvil, visible solo cuando está abierto */}
          {isMenuOpen && (
            <div className="lg:hidden flex flex-col w-full">
              {/* Contenedor para los botones del menú de hamburguesa */}
              <div className="flex flex-wrap justify-start gap-4 mb-4">
                <div className="w-[calc(50%-8px)]">
                  <SobreComunidadButton />
                </div>
                <div className="w-[calc(50%-8px)]">
                  <ComunidadButton />
                </div>
                <div className="w-[calc(50%-8px)]">
                  <Academias />
                </div>
                <div className="w-[calc(50%-8px)]">
                  <Cursos />
                </div>
                <div className="w-[calc(50%-8px)]">
                  <Contactenos />
                </div>
              </div>
              
              {/* Barra de búsqueda para móvil, debajo de los botones */}
              <BarraBusqueda className="w-full" />
            </div>
          )}

          {cargandoUsuario ? (
            <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap">
              Cargando...
            </div>
          ) : usuario ? (
            <div className="relative z-50 lg:ml-6" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white"
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
                    ?
                  </div>
                )}
              </button>

              <div
                className={`${
                  isProfileOpen ? "opacity-100 visible" : "opacity-0 invisible"
                } transition-all duration-300 ease-out
                  fixed lg:absolute right-4 lg:right-0 top-[80px] lg:top-full mt-2
                  w-44 bg-white rounded-lg shadow-lg py-2 z-50`}
              >
                <button
                  onClick={() => {
                    router.push("/perfil");
                    setIsProfileOpen(false);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 font-medium hover:text-cyan-600 transition-colors duration-200"
                >
                  Perfil
                </button>
                <button
                  onClick={() => {
                    cerrarSesion();
                    setIsProfileOpen(false);
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
