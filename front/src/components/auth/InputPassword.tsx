import React from "react";

interface Props {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  required?: boolean;
  disabled?: boolean;
}

const InputPassword: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  togglePasswordVisibility,
  required,
  disabled = false,
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
        disabled={disabled}
        className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-yellow-400 placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
};

export default InputPassword;
