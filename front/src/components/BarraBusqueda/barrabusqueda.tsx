"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface BarraBusquedaProps {
  className?: string;
}

interface Item {
  id: number;
  titulo: string;
  claseItem: string;
  duracionHoras: number;
}

export default function BarraBusqueda({ className }: BarraBusquedaProps) {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Item[]>([]);
  const [data, setData] = useState<Item[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reemplazá esta URL por la de tu API real
    fetch("/api/cursos")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    const texto = query.toLowerCase();
    const filtrados = data.filter(
      (item) =>
        item.titulo.toLowerCase().includes(texto) ||
        item.claseItem.toLowerCase().includes(texto) ||
        item.id.toString().includes(texto) ||
        item.duracionHoras.toString().includes(texto)
    );
    setResultados(texto ? filtrados : []);
    setShowDropdown(texto.length > 0 && filtrados.length > 0);
  }, [query, data]);

  const manejarRedireccion = (item: Item) => {
    router.push(`/cursos/${item.id}`);
    setQuery("");
    setResultados([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && resultados.length > 0) {
      manejarRedireccion(resultados[0]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div
        className={clsx(
          `flex items-center border focus-within:border-indigo-500 transition duration-300 
           px-2 gap-2 bg-white border-gray-500/30 h-12 rounded-[5px] overflow-hidden w-full`,
          className
        )}
      >
        <input
          type="text"
          placeholder="Busca tu próximo curso"
          className="w-full h-full pl-2 outline-none placeholder-gray-500 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 30 30"
          fill="#6B7280"
          className="w-5 h-5"
        >
          <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
        </svg>
      </div>

      {showDropdown && (
        <ul className="absolute z-10 bg-white w-full border mt-1 rounded-md max-h-60 overflow-auto shadow-md">
          {resultados.map((item) => (
            <li
              key={item.id}
              onClick={() => manejarRedireccion(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              <strong>{item.claseItem.toUpperCase()}</strong> - {item.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
