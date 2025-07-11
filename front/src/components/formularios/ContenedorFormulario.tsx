import React, { useEffect } from "react";

interface PropsContenedorFormulario {
  titulo: string;
  children: React.ReactNode;
  className?: string;
}

const ContenedorFormulario: React.FC<PropsContenedorFormulario> = ({
  titulo,
  children,
  className = "",
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: "url(/bombillo-blanco.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`bg-gray-950 w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ${className}`}
      >
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)] animate-pulse">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default ContenedorFormulario;
