'use client';

import React from 'react';

interface AlertaProfesionalProps {
  mensaje: string;
  tipo?: 'error' | 'info' | 'exito';
}

export default function AlertaProfesional({ mensaje, tipo = 'info' }: AlertaProfesionalProps) {
  const colores = {
    error: 'bg-red-100 border-red-500 text-red-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    exito: 'bg-green-100 border-green-500 text-green-700',
  };

  return (
    <div
      className={`max-w-md mx-auto mt-20 p-6 rounded-md border font-semibold text-center select-none ${
        colores[tipo]
      } shadow-md`}
      role="alert"
    >
      {mensaje}
    </div>
  );
}
