'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FormularioCheckbox({
  label,
  id,
  name,
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
}
