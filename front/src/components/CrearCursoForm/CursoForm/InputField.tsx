'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  step?: number;
  required?: boolean;
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  min,
  step,
  required = true,
}: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
        required={required}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
