'use client';

import React from "react";
import clsx from "clsx";

interface Contenedor1Props {
  bgColor?: string;
  children?: React.ReactNode;
  className?: string;
}

const Contenedor_1: React.FC<Contenedor1Props> = ({
  bgColor = "bg-gray-200",
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        `
          w-full max-w-[960px] mx-auto 
          min-h-[auto] sm:min-h-[592px] 
          ${bgColor} rounded-lg p-3 sm:p-4 
          flex flex-col items-center justify-center
        `,
        className
      )}
    >
      {children ? (
        children
      ) : (
        <div className="p-3 sm:p-6 w-full">
          <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-blue-800">
            ¿Por qué elegirnos?
          </h2>
          {/* CAMBIO: Usamos flex-col por defecto para apilar y md:grid para pantallas medianas o más grandes */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 gap-2">
            {/* Tarjeta 1 */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-lg sm:text-2xl">🎮</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Capacitaciones que no aburren
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600">
                  Cursos interactivos donde cada lección se siente como un
                  desafío superado.
                </p>
              </div>
            </div>
            {/* Tarjeta 2 */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-lg sm:text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Resultados medibles
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600">
                  Analizamos datos en tiempo real para ajustar el aprendizaje a
                  tus necesidades.
                </p>
              </div>
            </div>
            {/* Tarjeta 3 */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-lg sm:text-2xl">🖥️</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Tecnología accesible
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600">
                  Plataforma intuitiva que reduce la curva de aprendizaje para
                  docentes y empresas.
                </p>
              </div>
            </div>
            {/* Tarjeta 4 */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 hover:shadow-lg transition-shadow">
              <span className="text-lg sm:text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Productividad inmediata
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600">
                  Microlecciones aplicables desde el primer día, optimizando
                  tiempo y recursos.
                </p>
              </div>
            </div>
            {/* Tarjeta 5 */}
            {/* CAMBIO: En pantallas pequeñas, ocupa 1 columna por defecto, y en md o más, ocupa 2 */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 hover:shadow-lg transition-shadow md:col-span-2">
              <span className="text-lg sm:text-2xl">🌟</span>
              <div>
                <h3 className="font-semibold text-blue-600 text-xs sm:text-base">
                  Bienestar educativo
                </h3>
                <p className="text-[0.65rem] sm:text-sm text-gray-600">
                  Dinámicas que reducen el estrés y motivan a equipos y
                  profesores.
                </p>
              </div>
            </div>
          </div>
          {/* Frase final destacada */}
          <div className="mt-3 sm:mt-6 bg-blue-100 text-blue-800 rounded-lg py-2 sm:py-3 px-2 sm:px-4 text-center italic font-medium text-[0.65rem] sm:text-base">
            En Bara Creativa no solo aprendes: jugás, creces y transformas tu
            realidad.
          </div>
        </div>
      )}
    </div>
  );
};

export default Contenedor_1;