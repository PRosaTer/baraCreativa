"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log("Buscando:", searchValue);
    // Lógica para la barra de búsqueda
  };

  return (
    <nav className="bg-[#282323] shadow-lg sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0 flex items-center space-x-6">
            <Link href="/" passHref>
              <Image
                src="/logo-bc.jpg"
                alt="Logo de tu Empresa"
                width={66}
                height={53}
                className="cursor-pointer"
              />
            </Link>
            <Link href="/comunidad" passHref>
              <button className="text-[#F2E4E4] hover:text-gray-300 px-3 py-2 text-base font-medium transition duration-300 whitespace-nowrap">
                Comunidad
              </button>
            </Link>
            <Link href="/sobre-nosotros" passHref>
              <button className="text-[#F2E4E4] hover:text-gray-300 px-3 py-2 text-base font-medium transition duration-300 whitespace-nowrap">
                Sobre Nosotros
              </button>
            </Link>
          </div>
          <div className="mx-auto w-[320px] ml-12 mr-12"> 
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Buscar cursos"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-6">
            <Link href="/cursos" passHref>
              <button className="text-[#F2E4E4] hover:text-gray-300 px-3 py-2 text-base font-medium transition duration-300 whitespace-nowrap">
                Cursos
              </button>
            </Link>
            <Link href="/contactenos" passHref>
              <button className="text-[#F2E4E4] hover:text-gray-300 px-3 py-2 text-base font-medium transition duration-300 whitespace-nowrap">
                Contáctenos
              </button>
            </Link>
            <Link href="/acceso" passHref>
              <button className="text-[#F2E4E4] hover:text-gray-300 px-3 py-2 text-base font-medium transition duration-300 whitespace-nowrap">
                Acceso/Usuario
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}