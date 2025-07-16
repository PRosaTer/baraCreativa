// components/SelectField.tsx
import React, { ChangeEvent } from "react";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={inputStyle}
    >
      <option value="">Seleccione {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: 8,
  border: "none",
  marginBottom: 16,
  fontSize: 16,
  boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};
