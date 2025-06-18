import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PropsCampoContrasena {
  etiqueta: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requerido?: boolean;
}

const CampoContrasena: React.FC<PropsCampoContrasena> = ({
  etiqueta,
  nombre,
  valor,
  onChange,
  requerido = false,
}) => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  return (
    <div className="flex flex-col space-y-2 relative">
      <label className="text-sm font-medium text-gray-800">{etiqueta}</label>
      <input
        type={mostrarContrasena ? "text" : "password"}
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      />
      <button
        type="button"
        onClick={() => setMostrarContrasena(!mostrarContrasena)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
      >
        {mostrarContrasena ? (
          <FaEyeSlash className="w-5 h-5" />
        ) : (
          <FaEye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default CampoContrasena;
