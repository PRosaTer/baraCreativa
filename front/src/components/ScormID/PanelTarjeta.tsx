import React from 'react';

interface PanelTarjetaProps {
  titulo?: string;
  children: React.ReactNode;
  claseAdicional?: string;
  colorBordeHover?: 'accent-cyan' | 'accent-magenta' | 'accent-lime';
  classNameTitulo?: string;
  classNameContenido?: string;
  conEfectoEscaneo?: boolean; 
  conEfectoBrilloImagen?: boolean;
}

export function PanelTarjeta({
  titulo,
  children,
  claseAdicional = '',
  colorBordeHover = 'accent-cyan', 
  classNameTitulo = '',
  classNameContenido = '',
  conEfectoEscaneo = false,
  conEfectoBrilloImagen = false,
}: PanelTarjetaProps) {
  const hoverBorderClass = `hover:border-${colorBordeHover}`;
  const borderBottomColorClass = `border-b border-${colorBordeHover}/30`; 


  const colorTituloClass =
    colorBordeHover === 'accent-magenta'
      ? 'text-accent-magenta'
      : colorBordeHover === 'accent-lime'
      ? 'text-accent-lime'
      : 'text-accent-cyan';

  return (
    <div
      className={`
        bg-mid-dark-bg p-6 rounded-xl shadow-lg border border-mid-dark-bg
        transform transition-all duration-300 hover:scale-[1.01] ${hoverBorderClass}
        relative overflow-hidden group
        ${claseAdicional}
      `}
    >
      {titulo && (
        <h3
          className={`
            text-xl sm:text-2xl font-bold mb-4 pb-2 ${borderBottomColorClass}
            ${colorTituloClass}
            ${classNameTitulo}
          `}
        >
          {titulo}
        </h3>
      )}
      <div className={classNameContenido}>
        {children}
      </div>

      {conEfectoEscaneo && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-cyan/[0.05] to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[120%] transition-transform duration-700 ease-out pointer-events-none"></div>
      )}

      {conEfectoBrilloImagen && (
        <div className="absolute inset-0 bg-diagonal-scanline opacity-[0.05] animate-shimmer-slow pointer-events-none"></div>
      )}
    </div>
  );
}