import React from "react";

interface PropsContenedorFormularioContacto {
  titulo: string;
  children: React.ReactNode;
}

const ContenedorFormularioContacto: React.FC<
  PropsContenedorFormularioContacto
> = ({ titulo, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 mt-8 mb-8">
      {/* <div className="bg-gray-950 backdrop-blur-md w-full max-w-lg p-8 rounded-xl shadow-2xl border-2 border-yellow-400/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.7)]"> */}
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)] animate-pulse">
          {titulo}
        </h2>
        {children}
      </div>
    // </div>
  );
};

export default ContenedorFormularioContacto;
