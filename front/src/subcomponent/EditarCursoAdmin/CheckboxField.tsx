// components/CheckboxField.tsx
import React, { ChangeEvent } from "react";

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
}) => (
  <label style={checkboxLabelStyle}>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      style={{ marginRight: 8 }}
    />
    {label}
  </label>
);

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: 12,
};
