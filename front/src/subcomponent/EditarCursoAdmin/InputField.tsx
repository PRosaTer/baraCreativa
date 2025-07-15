// components/InputField.tsx
import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  rows?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  rows,
}) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {rows ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        style={{ ...inputStyle, resize: "vertical" }}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={type === "number" ? 0 : undefined}
        step={type === "number" && name === "precio" ? 0.01 : 1}
        style={inputStyle}
      />
    )}
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
