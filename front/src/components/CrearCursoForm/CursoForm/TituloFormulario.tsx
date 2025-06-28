"use client";

import React from 'react';

interface Props {
  esEdicion: boolean;
}

export default function TituloFormulario({ esEdicion }: Props) {
  return (
    <h2 className="text-2xl font-bold mb-4">{esEdicion ? 'Editar Curso' : 'Crear Nuevo Curso'}</h2>
  );
}
