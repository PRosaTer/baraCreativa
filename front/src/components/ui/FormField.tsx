import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  id,
  type = "text",
  placeholder,
  ...rest
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-800"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default FormField;