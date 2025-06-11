"use client";

import React from 'react';
import Logo from '../logo';
import ComunidadButton from '../Botones/sobre-nosotros';
import SobreComunidadButton from '../Botones/comunidad';
import BarraBusqueda from '../BarraBusqueda/barrabusqueda';
import Cursos from '../Botones/cursos';
import Contactenos from '../Botones/contactenos';
import Acceso from '../Botones/acceso';

export default function Navbar() {
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
          <Acceso />
        </div>
      </div>
    </nav>
  );
}
