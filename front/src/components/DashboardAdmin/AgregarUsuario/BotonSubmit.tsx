"use client";

import React from 'react';

interface Props {
  loading: boolean;
}

export default function BotonSubmit({ loading }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="bg-black text-white px-4 py-2 rounded hover:bg-red-600 w-full"
    >
      {loading ? 'Creando...' : 'Crear Usuario'}
    </button>
  );
}
