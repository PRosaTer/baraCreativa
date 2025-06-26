"use client";

import React, { useEffect } from 'react';
import Logo from '../logo';
import ComunidadButton from '../Botones/sobre-nosotros';
import SobreComunidadButton from '../Botones/comunidad';
import BarraBusqueda from '../BarraBusqueda/barrabusqueda';
import Cursos from '../Botones/cursos';
import Contactenos from '../Botones/contactenos';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import BotonConEfecto from '../Botones/BotonConEfecto';

export default function Navbar() {
  const { usuario, cargandoUsuario, cerrarSesion } = useAuth();


  useEffect(() => {
    console.log("NAVBAR - Usuario:", usuario);
    console.log("NAVBAR - CargandoUsuario:", cargandoUsuario);
  }, [usuario, cargandoUsuario]);

  return (
    <nav className="w-full bg-primary py-2 sm:py-4">
      <div className="
        flex items-center justify-between
        w-full max-w-screen-xl mx-auto
        px-2 sm:px-4 md:px-8 lg:px-20
        gap-x-[54px]
      ">
        <div className="flex items-center justify-start w-full gap-x-[34px]">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <SobreComunidadButton />
          <ComunidadButton />
          <BarraBusqueda className="flex-grow min-w-[200px] max-w-[656px]" />
          <Cursos />
          <Contactenos />

          {cargandoUsuario ? (
            <div className="
              px-4 py-2 rounded-lg font-medium text-white bg-gray-400
              transition duration-300 whitespace-nowrap animate-pulse
            ">
              Cargando...
            </div>
          ) : usuario ? (
            <div className="relative group">
              <BotonConEfecto
                texto={`Hola, ${usuario.nombreCompleto.split(' ')[0]}`}
                href="/perfil"
              />
              <div className="absolute right-0 top-full w-fit bg-white rounded-md shadow-lg py-1 z-10
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-opacity duration-700 ease-out
                  flex flex-col items-center">
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
            <BotonConEfecto
              texto="Acceso"
              href="/login"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
