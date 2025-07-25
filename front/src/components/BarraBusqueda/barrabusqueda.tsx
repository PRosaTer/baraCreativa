"use client";

import { clsx } from "clsx";

interface BarraBusquedaProps {
  className?: string;
}

export default function BarraBusqueda({ className }: BarraBusquedaProps) {
  return (
    <div
      className={clsx(
        `flex items-center border focus-within:border-indigo-500 transition duration-300 pr-2 sm:pr-3 gap-1 sm:gap-2 bg-white border-gray-500/30 h-10 sm:h-12 rounded-[5px] overflow-hidden`,
        className
      )}
    >
      <input
        type="text"
        placeholder="Busca tu próximo curso"
        className="w-full h-full pl-2 sm:pl-4 outline-none placeholder-gray-500 text-xs sm:text-sm"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 30 30"
        fill="#6B7280"
        className="w-5 sm:w-6 h-5 sm:h-6"
      >
        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
      </svg>
    </div>
  );
}
