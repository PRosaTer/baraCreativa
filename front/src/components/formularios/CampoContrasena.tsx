import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PropsCampoContrasena {
  etiqueta: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requerido?: boolean;
  error?: string | null;
  className?: string;
  inputClassName?: string;
}

const CampoContrasena: React.FC<PropsCampoContrasena> = ({
  etiqueta,
  nombre,
  valor,
  onChange,
  requerido = false,
  error = null,
  className = "",
  inputClassName = "",
}) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  return (
    <div className={`flex flex-col space-y-2 relative ${className}`}>
      <label htmlFor={nombre} className="text-sm font-medium text-gray-800">
        {etiqueta}
        {requerido && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={nombre}
        type={mostrarContrasena ? "text" : "password"}
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 
                    placeholder-gray-400 focus:outline-none focus:ring-2 
                    transition duration-200
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}
                    ${inputClassName}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${nombre}-error` : undefined}
      />
      <button
        type="button"
        onClick={() => setMostrarContrasena(!mostrarContrasena)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
        aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {mostrarContrasena ? (
          <FaEyeSlash className="w-5 h-5" />
        ) : (
          <FaEye className="w-5 h-5" />
        )}
      </button>
      {error && (
        <p id={`${nombre}-error`} className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default CampoContrasena;