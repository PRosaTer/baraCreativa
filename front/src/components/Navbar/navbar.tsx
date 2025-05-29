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
    <nav className="
      w-full bg-primary 
      py-2 sm:py-4
      // px-2 sm:px-4 md:px-8 lg:px-12
    ">

      <div className="
        flex flex-col sm:flex-row md:flex-row lg:flex-row
        items-center // Centra verticalmente los ítems (cuando están en fila) o horizontalmente (cuando están en columna)
        justify-center md:justify-between lg:justify-between // Distribución horizontal (centrado en móvil, espaciado en desktop)
        
        // Controla el ancho del CONTENIDO de la navbar y lo centra
        w-full // Ocupa todo el ancho disponible en la pantalla actual
        max-w-7xl // Por ejemplo, 7xl para pantallas muy grandes (1280px)
        mx-auto // Centra este div horizontalmente dentro de la nav
        
        px-2 sm:px-4 md:px-8 lg:px-12 // Padding horizontal para el contenido (dentro del max-w)
        gap-y-2 sm:gap-x-2 md:gap-x-4 lg:gap-x-6 // Espaciado responsivo entre grupos de elementos
      ">
        <Logo />


        <div className="
          flex flex-col sm:flex-row 
          items-center justify-center 
          gap-y-1 sm:gap-x-2 md:gap-x-4 lg:gap-x-6 
          mt-2 sm:mt-0 
        ">
          <ComunidadButton />
          <SobreNosotrosButton />
        </div>

        <div className="
          flex-grow max-w-[656px] // Permite que crezca y ocupe el espacio, hasta un máximo
          w-full px-2 sm:w-auto sm:px-0 
          mt-2 sm:mt-0 
          order-none // Mantener el orden normal
        ">
          <BarraBusqueda />
        </div>

        <div className="
          flex flex-col sm:flex-row 
          items-center justify-center 
          gap-y-1 sm:gap-x-2 md:gap-x-4 lg:gap-x-6 
          mt-2 sm:mt-0 
        ">
          <Cursos />
          <Contactenos />
          <Acceso />
        </div>
      </div> 
    </nav>
  );
}