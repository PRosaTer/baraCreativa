"use client";

import React from 'react';

interface Props {
  onCancelar: () => void;
  guardando: boolean;
  esEdicion: boolean;
}

export default function BotonesFormulario({ onCancelar, guardando, esEdicion }: Props) {
  return (
    <div className="flex justify-between mt-6">
      <button type="button" onClick={onCancelar} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" disabled={guardando}>
        Cancelar
      </button>
      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled={guardando}>
        {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Curso' : 'Crear Curso'}
      </button>
    </div>
  );
}
