'use client';

import React from 'react';
import { Curso } from '@/app/types/curso';
import EditarCursoAdmin from './EditarCursoAdmin';

interface Props {
  cursoEditando: Curso | null;
  cerrarEditor: () => void;
  actualizarCursoEnLista: (curso: Curso) => Promise<void>;
}

export default function ModalEditarCursoWrapper({ cursoEditando, cerrarEditor, actualizarCursoEnLista }: Props) {
  if (!cursoEditando) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <EditarCursoAdmin
          curso={cursoEditando}
          onGuardar={actualizarCursoEnLista}
          onCancelar={cerrarEditor}
        />
      </div>
    </div>
  );
}
