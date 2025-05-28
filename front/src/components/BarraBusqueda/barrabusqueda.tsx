import React from 'react';

export default function BarraBusqueda() {
  return (
    <div className="h-[53px] bg-white rounded-[20px] flex items-center px-4 w-full max-w-[656px] lg:ml-[60px]">
      <input
        type="text"
        placeholder="Buscar cursos"
        className="flex-grow bg-transparent outline-none text-foreground placeholder:text-foreground/50 text-center"
      />
    </div>
  );
}
