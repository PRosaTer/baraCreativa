import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputTexto: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  disabled = false,
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-yellow-400 placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
    />
  );
};

export default InputTexto;
