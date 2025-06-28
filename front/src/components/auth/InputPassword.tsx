import React from "react";

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  required?: boolean;
}

const InputPassword: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  togglePasswordVisibility,
  required,
}) => {
  return (
    <div className="relative">
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border p-2 rounded"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-2 top-2 text-gray-600"
      >
        {showPassword ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
};

export default InputPassword;
