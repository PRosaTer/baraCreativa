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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden"
      style={{
        backgroundImage: `url(/bombillo-negro.png)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ${className}`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default ContenedorFormulario;