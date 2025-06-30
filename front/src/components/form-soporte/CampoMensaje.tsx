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
      <label className="text-sm font-medium text-yellow-600">{etiqueta}</label>
      <textarea
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-red-300 rounded-lg bg-yellow-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 resize-y min-h-[120px]"
      />
    </div>
  );
};

export default CampoMensaje;
