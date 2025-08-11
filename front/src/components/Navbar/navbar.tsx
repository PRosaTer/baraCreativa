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
  const navbarRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      if (
        navbarRef.current &&
        isMenuOpen &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);


  const getProfileImageUrl = (fotoPerfil: string | null | undefined) => {
    if (!fotoPerfil) {
      return null;
    }

    if (fotoPerfil.startsWith('http') || fotoPerfil.startsWith('/')) {
      return fotoPerfil;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${fotoPerfil}`;
  };

  const profileImageUrl = usuario ? getProfileImageUrl(usuario.fotoPerfil) : null;

  return (
    <nav className={`w-full bg-primary mt-[5px] h-[100px] relative z-30`} ref={navbarRef}>
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Logo />
          <button
            className="lg:hidden text-white ml-2 z-[60] relative"
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
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Menú de navegación principal para desktop */}
        <div
          className={`
            hidden lg:flex flex-col lg:flex-row lg:items-center
            w-full lg:w-auto
            p-6 lg:p-0
            z-50
          `}
        >
          <div className="flex flex-row items-center w-full lg:w-auto gap-4 lg:gap-6">
            <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
              <SobreComunidadButton />
              <ComunidadButton />
              <Academias />
            </div>

            <BarraBusqueda className="hidden lg:flex flex-grow min-w-[200px] max-w-[656px] lg:max-w-[400px] xl:max-w-[656px]" />

            <div className="hidden lg:flex flex-row items-center gap-4 lg:gap-6">
              <Cursos />
              <Contactenos />
            </div>
          </div>
          {cargandoUsuario ? (
            <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap lg:ml-6">
              Cargando...
            </div>
          ) : usuario ? (
            <div className="relative z-[60] lg:ml-6 flex items-center justify-center lg:justify-start" ref={profileMenuRef}>
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
                  absolute right-0 top-full mt-2
                  w-44 bg-white rounded-lg shadow-lg py-2 z-[70]`}
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
            <BotonConEfecto texto="Acceso" href="/login" className="lg:ml-6 mt-4 lg:mt-0" />
          )}
        </div>

        {/* Menú de hamburguesa para móvil, visible solo cuando está abierto */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-gray-900 backdrop-blur z-50 p-4">
            <div className="flex flex-col items-center space-y-4">
              <SobreComunidadButton className="w-full max-w-sm" />
              <ComunidadButton className="w-full max-w-sm" />
              <Academias className="w-full max-w-sm" />
              <Cursos className="w-full max-w-sm" />
              <Contactenos className="w-full max-w-sm" />
              <BarraBusqueda className="w-full max-w-sm" />
              {cargandoUsuario ? (
                <div className="px-4 py-2 rounded-lg font-medium text-white bg-gray-400 animate-pulse whitespace-nowrap w-full max-w-sm text-center">
                  Cargando...
                </div>
              ) : usuario ? (
                <div className="relative z-[60] flex items-center justify-center w-full max-w-sm" ref={profileMenuRef}>
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
                      absolute right-0 top-full mt-2
                      w-44 bg-white rounded-lg shadow-lg py-2 z-[70]`}
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
                <BotonConEfecto texto="Acceso" href="/login" className="w-full max-w-sm" />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
