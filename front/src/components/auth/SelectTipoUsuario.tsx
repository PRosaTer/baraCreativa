import React from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const SelectTipoUsuario: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <select
      name="tipoUsuario"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
      required
    >
      <option value="Alumno">Alumno</option>
      <option value="Empresa">Empresa</option>
    </select>
  );
};

export default SelectTipoUsuario;
