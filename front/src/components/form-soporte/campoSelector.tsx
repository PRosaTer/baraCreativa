import React from "react";

interface PropsCampoSelector {
  etiqueta: string;
  nombre: string;
  valor: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  opciones: { valor: string; texto: string }[];
  requerido?: boolean;
}

const CampoSelector: React.FC<PropsCampoSelector> = ({
  etiqueta,
  nombre,
  valor,
  onChange,
  opciones,
  requerido = false,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="block font-bold text-yellow-400 drop-shadow-md">
        {etiqueta}
      </label>
      <select
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 hover:bg-gray-700 hover:scale-[1.02]"
      >
        {opciones.map((opcion) => (
          <option
            key={opcion.valor}
            value={opcion.valor}
            className="bg-gray-900 text-white"
          >
            {opcion.texto}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampoSelector;
