'use client';

import React, { ChangeEvent } from 'react';
import { Search } from 'lucide-react';

interface Props {
  valor: string;
  onCambio: (valor: string) => void;
}

export default function BarraBusquedaUsuarios({ valor, onCambio }: Props) {
  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    onCambio(e.target.value);
  };

  return (
    <div className="relative mt-[-14px]">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
        <Search size={18} />
      </span>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={valor}
        onChange={manejarCambio}
        className="pl-10 pr-4 py-2 h-9 border border-black rounded-2xl bg-white text-black placeholder-black 
                   focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200"
      />
    </div>
  );
}
