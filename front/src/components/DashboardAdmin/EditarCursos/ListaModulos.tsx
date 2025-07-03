import React from 'react';

export interface InlineToastProps {
  mensaje: string;
  onClose: () => void;
  type: 'success' | 'error';
}

export default function InlineToast({ mensaje, onClose, type }: InlineToastProps) {
  return (
    <div
      className={`p-4 rounded mb-4 ${
        type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{mensaje}</span>
        <button onClick={onClose} className="ml-4 text-sm underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}
