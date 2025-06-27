import React from "react";

interface PropsContenedorFormularioContacto {
  titulo: string;
  children: React.ReactNode;
}

const ContenedorFormularioContacto: React.FC<
  PropsContenedorFormularioContacto
> = ({ titulo, children }) => {
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
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-8">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default ContenedorFormularioContacto;
