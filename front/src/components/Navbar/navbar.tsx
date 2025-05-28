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
    <nav className="w-full h-[108px] bg-primary flex items-center px-4">
      <Logo />
      <ComunidadButton />
      <SobreNosotrosButton />
      <div className="flex-grow ml-[24px] max-w-[656px]">
        <BarraBusqueda />
      </div>
      <Cursos />
      <Contactenos />
      <Acceso />
    </nav>
  );
}
