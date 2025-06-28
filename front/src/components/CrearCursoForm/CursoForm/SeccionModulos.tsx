"use client";

import React from 'react';
import ModuloItem from './ModuloItem';
import { Modulo } from '@/app/types/curso';

interface Props {
  modulos: Modulo[];
  handleModuloChange: (index: number, field: 'titulo' | 'descripcion', value: string) => void;
  eliminarModulo: (index: number) => void;
  agregarModulo: () => void;
}

export default function SeccionModulos({ modulos, handleModuloChange, eliminarModulo, agregarModulo }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Módulos</h3>
      {modulos.map((modulo, i) => (
        <ModuloItem
          key={i}
          index={i}
          titulo={modulo.titulo}
          descripcion={modulo.descripcion}
          onTituloChange={(value) => handleModuloChange(i, 'titulo', value)}
          onDescripcionChange={(value) => handleModuloChange(i, 'descripcion', value)}
          onEliminar={() => eliminarModulo(i)}
        />
      ))}
      <button type="button" onClick={agregarModulo} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Agregar Módulo
      </button>
    </div>
  );
}
