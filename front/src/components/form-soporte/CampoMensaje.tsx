import React from "react";

interface PropsCampoMensaje {
  etiqueta: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  requerido?: boolean;
  placeholder?: string;
}

const CampoMensaje: React.FC<PropsCampoMensaje> = ({
  etiqueta,
  nombre,
  valor,
  onChange,
  requerido = false,
  placeholder,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-800">{etiqueta}</label>
      <textarea
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y min-h-[100px]"
      />
    </div>
  );
};

export default CampoMensaje;
