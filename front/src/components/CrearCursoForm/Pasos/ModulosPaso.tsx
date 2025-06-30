'use client';

import React from 'react';
import ListaModulos from '../../DashboardAdmin/EditarCursos/ListaModulos';
import { ModuloForm } from '@/app/types/curso';

interface Props {
  modulos: ModuloForm[];
  onAgregarModulo: () => void;
  onModificarModulo: (index: number, campo: keyof ModuloForm, valor: string | File | null) => void;
  onEliminarModulo: (index: number) => void;
}

export default function ModulosPaso({ modulos, onAgregarModulo, onModificarModulo, onEliminarModulo }: Props) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Módulos</h3>
      <ListaModulos
        modulos={modulos}
        onAgregar={onAgregarModulo}
        onModificar={onModificarModulo}
        onEliminar={onEliminarModulo}
      />
    </div>
  );
}
