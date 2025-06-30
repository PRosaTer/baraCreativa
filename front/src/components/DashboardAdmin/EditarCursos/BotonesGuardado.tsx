import React from 'react';

interface Props {
  cargando: boolean;
  onCancelar: () => void;
}

export default function BotonesGuardado({ cargando, onCancelar }: Props) {
  return (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={onCancelar}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        disabled={cargando}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={cargando}
      >
        {cargando ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
}
