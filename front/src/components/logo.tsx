import Image from 'next/image';
import React from 'react';

export default function Logo() {
  return (
    <div className="
      flex items-center

      w-[50px] h-[40px] sm:w-[60px] sm:h-[48px] md:w-[66px] md:h-[53px] // Tamaño responsivo del div contenedor
      ml-2 sm:ml-4 md:ml-6 lg:ml-0 // Margen izquierdo responsivo, o 0 si el Navbar usa 'gap'
    ">
      <Image
        src="/logo-bc.png"
        alt="Bara Creativa Logo"
        width={66} 
        height={53}
        priority
        className="object-contain w-full h-full"
      />
    </div>
  );
}