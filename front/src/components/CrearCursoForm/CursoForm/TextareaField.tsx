'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
}

export default function TextareaField({
  label,
  name,
  value,
  onChange,
  rows = 3,
  required = true,
}: Props) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}
