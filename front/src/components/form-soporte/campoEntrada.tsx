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
      <label className="text-sm font-medium text-yellow-600">{etiqueta}</label>
      <input
        type={tipo}
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 border border-red-300 rounded-lg bg-yellow-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default CampoEntrada;
