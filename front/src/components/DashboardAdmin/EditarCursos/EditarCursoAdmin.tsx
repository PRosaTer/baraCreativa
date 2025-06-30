'use client';

import React from 'react';
import CrearCursoMultiStep from '../../CrearCursoForm/CrearCursoMultiStep';
import { Curso } from '@/app/types/curso';

interface Props {
  curso: Curso;
  onGuardar: (cursoActualizado: Curso) => void;
  onCancelar: () => void;
}

export default function EditarCursoAdmin({ curso, onGuardar, onCancelar }: Props) {
  const handleCursoEditado = (cursoActualizado: Curso) => {
    onGuardar(cursoActualizado);
  };

  return (
    <CrearCursoMultiStep
      onCursoCreado={handleCursoEditado}
      cursoInicial={curso}
      onCancelar={onCancelar}
    />
  );
}
