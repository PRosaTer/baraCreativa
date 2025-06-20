import React from "react";

interface PropsCampoEntrada {
  etiqueta: string;
  tipo: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requerido?: boolean;
  error?: string | null;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

const CampoEntrada: React.FC<PropsCampoEntrada> = ({
  etiqueta,
  tipo,
  nombre,
  valor,
  onChange,
  requerido = false,
  error = null,
  className = "",
  inputClassName = "",
  placeholder,
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label htmlFor={nombre} className="text-sm font-medium text-gray-800">
        {etiqueta}
        {requerido && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={nombre}
        type={tipo}
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 
                    placeholder-gray-400 focus:outline-none focus:ring-2 
                    transition duration-200
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}
                    ${inputClassName}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${nombre}-error` : undefined}
      />
      {error && (
        <p id={`${nombre}-error`} className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default CampoEntrada;