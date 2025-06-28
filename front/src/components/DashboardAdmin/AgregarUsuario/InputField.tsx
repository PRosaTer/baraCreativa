"use client";

import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export default function InputField({ name, ...rest }: Props) {
  return (
    <input
      name={name}
      {...rest}
      className="w-full border p-2 rounded"
    />
  );
}
