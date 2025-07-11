import React from "react";

interface PropsCampoEntrada {
  etiqueta: string;
  tipo: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requerido?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const CampoEntrada: React.FC<PropsCampoEntrada> = ({
  etiqueta,
  tipo,
  nombre,
  valor,
  onChange,
  requerido = false,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="block font-bold text-yellow-400 drop-shadow-md">
        {etiqueta}
      </label>
      <input
        type={tipo}
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
      />
    </div>
  );
};

export default CampoEntrada;
