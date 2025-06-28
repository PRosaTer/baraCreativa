import React from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectTipoUsuario: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      name="tipoUsuario"
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded"
      required
    >
      <option value="Alumno">Alumno</option>
      <option value="Empresa">Empresa</option>
    </select>
  );
};

export default SelectTipoUsuario;
