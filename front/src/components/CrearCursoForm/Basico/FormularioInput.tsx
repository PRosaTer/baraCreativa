'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  id: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: number;
}

export default function FormularioInput({
  label,
  id,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  min,
  step,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
  );
}
