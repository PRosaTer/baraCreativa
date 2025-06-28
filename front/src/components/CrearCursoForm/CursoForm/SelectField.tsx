'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
