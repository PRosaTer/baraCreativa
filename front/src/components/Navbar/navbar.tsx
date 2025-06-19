"use client";

import React, { useState, useEffect } from "react";
import Logo from "../logo";
import ComunidadButton from "../Botones/sobre-nosotros";
import SobreComunidadButton from "../Botones/comunidad";
import BarraBusqueda from "../BarraBusqueda/barrabusqueda";
import Cursos from "../Botones/cursos";
import Contactenos from "../Botones/contactenos";
import Acceso from "../Botones/acceso";
import { useRouter } from "next/navigation";

// Definir el tipo para el estado user
interface User {
  name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // Inicializar como null o User
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token al montar el componente
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "nombre de la persona" }); // Usar texto fijo en lugar del token
    }

    // Escuchar el evento de login
    const handleLogin = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setUser({ name: "nombre de la persona" }); // Actualizar con texto fijo al logueo
      }
    };

    window.addEventListener("userLoggedIn", handleLogin);

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener("userLoggedIn", handleLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    setUser(null); // Limpiar estado
    router.push("/"); // Redirigir al inicio
  };

  return (
    <nav className="w-full bg-primary py-2 sm:py-4">
      <div
        className="
        flex items-center justify-between
        w-full max-w-screen-xl mx-auto
        px-2 sm:px-4 md:px-8 lg:px-20
        gap-x-[54px]
      "
      >
        <div className="flex items-center justify-start w-full gap-x-[34px]">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <SobreComunidadButton />
          <ComunidadButton />
          <BarraBusqueda className="flex-grow min-w-[200px] max-w-[656px]" />
          <Cursos />
          <Contactenos />
          {user ? (
            <div className="flex items-center gap-x-4">
              <span className="text-white font-medium">
                Bienvenido, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="
                  flex items-center justify-center 
                  bg-red-600 text-white relative overflow-hidden group z-10 
                  hover:text-white duration-1000 rounded-[20px] 
                  h-10 sm:h-12 
                  text-xs sm:text-sm md:text-base lg:text-xl 
                  w-24 sm:w-28 md:w-32 lg:w-40
                  -mr-20 sm:-mr-20 md:-mr-28 lg:-mr-10
                  px-2 sm:px-2 md:px-4 lg:px-6
                "
              >
                <span className="absolute bg-yellow-300 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                <span className="absolute bg-yellow-500 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                <span className="absolute bg-red-600 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Acceso />
          )}
        </div>
      </div>
    </nav>
  );
}
