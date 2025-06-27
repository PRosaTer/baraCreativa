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
      <label className="text-sm font-medium text-gray-800">{etiqueta}</label>
      <select
        name={nombre}
        value={valor}
        onChange={onChange}
        required={requerido}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CampoSelector;
