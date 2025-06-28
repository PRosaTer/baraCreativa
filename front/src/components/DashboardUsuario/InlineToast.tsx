"use client";

import React, { useEffect } from "react";

interface InlineToastProps {
  mensaje: string;
  onClose: () => void;
  posicion?: "arriba" | "abajo"; // Opcional, control de posición
}

export default function InlineToast({ mensaje, onClose, posicion = "arriba" }: InlineToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Defino estilos para posición
  const posicionClass = posicion === "abajo" ? "fixed bottom-4 left-1/2 transform -translate-x-1/2" : "fixed top-4 left-1/2 transform -translate-x-1/2";

  return (
    <div className={`${posicionClass} bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 font-semibold px-4 py-2 rounded shadow-md animate-fade-in-out z-50`}>
      {mensaje}
    </div>
  );
}
