"use client";

import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: string[];
}

export default function SelectField({ name, options, ...rest }: Props) {
  return (
    <select name={name} {...rest} className="w-full border p-2 rounded">
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
