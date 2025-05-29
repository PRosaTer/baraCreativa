"use client";

import React from 'react';
import Logo from '../logo';
import ComunidadButton from '../Botones/comunidad';
import SobreNosotrosButton from '../Botones/sobre-nosotros';
import BarraBusqueda from '../BarraBusqueda/barrabusqueda';
import Cursos from '../Botones/cursos';
import Contactenos from '../Botones/contactenos';
import Acceso from '../Botones/acceso';

export default function Navbar() {
  return (
    <nav className="w-full bg-primary py-2 sm:py-4">
      <div className="
        flex flex-wrap items-center justify-between
        w-full max-w-screen-xl mx-auto
        px-2 sm:px-4 md:px-8 lg:px-12
        gap-x-[54px] gap-y-3
      ">

     


        <div className="flex items-center gap-x-[34px] flex-wrap justify-center">
             <div className="flex-shrink-0">
          <Logo />
        </div>
          <ComunidadButton />
          <SobreNosotrosButton />
          <BarraBusqueda className="flex-grow min-w-[200px] max-w-[656px]" />
          <Cursos />
          <Contactenos />
          <Acceso />
        </div>
      </div>
    </nav>
  );
}
