// components/TwoSquares.jsx
"use client";

import React from "react";
import Square from "../square/page";
import Image from "next/image"; // Importamos Image para un ejemplo con imagen

const TwoSquares = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl mx-auto py-8">
      {/* Cuadrado 1 */}
      <Square bgColor="bg-gray-200">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Cuadrado 1</h2>
          <p>Contenido del primer cuadrado.</p>
          <ul className="mt-4 space-y-2"></ul>
        </div>
      </Square>
      {/* Cuadrado 2 */}
      <Square bgColor="bg-gray-300">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Cuadrado 2</h2>
          <p>Ejemplo con una imagen:</p>
          <div className="relative w-32 h-32 mx-auto mt-4">
            <Image
              src="/Facebook-Logo-Transparent-PNG.png" // Reutilizamos una imagen de tu carrusel
              alt="Ejemplo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </Square>
    </div>
  );
};

export default TwoSquares;
