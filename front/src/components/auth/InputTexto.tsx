import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const InputTexto: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border p-2 rounded"
    />
  );
};

export default InputTexto;
