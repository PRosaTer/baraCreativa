'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export default function FormularioTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
  );
}
