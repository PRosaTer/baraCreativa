import React from "react";

interface PropsBotonEnviar {
  texto: string;
  cargando?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  tipo?: "button" | "submit" | "reset";
  className?: string;
}

const BotonEnviar: React.FC<PropsBotonEnviar> = ({
  texto,
  cargando = false,
  onClick,
  tipo = "submit",
  className = "",
}) => {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={cargando}
      className={`w-full bg-black text-white py-3 rounded-lg font-medium 
                  ${cargando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600 focus:ring-red-500'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300
                  ${className}`}
    >
      {cargando ? 'Cargando...' : texto}
    </button>
  );
};

export default BotonEnviar;