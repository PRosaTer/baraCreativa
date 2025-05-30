// components/Contenedor_1.tsx
"use client";

import React from "react";

interface Contenedor1Props {
  bgColor?: string;
  children?: React.ReactNode; // Restauramos children
}

const Contenedor_1: React.FC<Contenedor1Props> = ({ children }) => {
  return (
    <div
      className={
        "w-[667px] h-[592px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center"
      }
    >
      {children ? (
        children // Si se pasa children, lo renderizamos
      ) : (
        // Contenido estático por defecto (para "¿Por qué elegirnos?")
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
            ¿Por qué elegirnos?
          </h2>
          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tarjeta 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-2xl">🎮</span>
              <div>
                <h3 className="font-semibold text-blue-600">
                  Capacitaciones que no aburren
                </h3>
                <p className="text-sm text-gray-600">
                  Cursos interactivos donde cada lección se siente como un
                  desafío superado.
                </p>
              </div>
            </div>
            {/* Tarjeta 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-blue-600">
                  Resultados medibles
                </h3>
                <p className="text-sm text-gray-600">
                  Analizamos datos en tiempo real para ajustar el aprendizaje a
                  tus necesidades.
                </p>
              </div>
            </div>
            {/* Tarjeta 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-2xl">🖥️</span>
              <div>
                <h3 className="font-semibold text-blue-600">
                  Tecnología accesible
                </h3>
                <p className="text-sm text-gray-600">
                  Plataforma intuitiva que reduce la curva de aprendizaje para
                  docentes y empresas.
                </p>
              </div>
            </div>
            {/* Tarjeta 4 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-blue-600">
                  Productividad inmediata
                </h3>
                <p className="text-sm text-gray-600">
                  Microlecciones aplicables desde el primer día, optimizando
                  tiempo y recursos.
                </p>
              </div>
            </div>
            {/* Tarjeta 5 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition-shadow sm:col-span-2">
              <span className="text-2xl">🌟</span>
              <div>
                <h3 className="font-semibold text-blue-600">
                  Bienestar educativo
                </h3>
                <p className="text-sm text-gray-600">
                  Dinámicas que reducen el estrés y motivan a equipos y
                  profesores.
                </p>
              </div>
            </div>
          </div>
          {/* Frase final destacada */}
          <div className="mt-6 bg-blue-100 text-blue-800 rounded-lg py-3 px-4 text-center italic font-medium">
            En Bara Creativa no solo aprendes: jugás, creces y transformas tu
            realidad.
          </div>
        </div>
      )}
    </div>
  );
};

export default Contenedor_1;
