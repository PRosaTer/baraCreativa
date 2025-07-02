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
      <label className="block font-bold text-yellow-400 drop-shadow-md">
        {etiqueta}
      </label>
      <textarea
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 resize-y min-h-[140px] hover:bg-gray-700 hover:scale-[1.02]"
      />
    </div>
  );
};

export default CampoMensaje;
