"use client";

import { Modulo } from "@/app/types/curso";

interface ListaModulosProps {
  modulos: Modulo[];
  currentModule: number;
  onModuleClick: (index: number) => void;
}

export default function ListaModulos({ modulos, currentModule, onModuleClick }: ListaModulosProps) {
  return (
    <div className="lista-modulos">
      {modulos.map((modulo, index) => (
        <button
          key={modulo.id}
          onClick={() => onModuleClick(index)}
          className={index === currentModule ? "activo" : ""}
        >
          {modulo.titulo}
        </button>
      ))}
    </div>
  );
}
