"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ComunidadButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/login")}
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
      
      Acceso
    </button>
  );
}
