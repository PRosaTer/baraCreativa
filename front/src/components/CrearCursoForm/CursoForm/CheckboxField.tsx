'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxField({
  label,
  name,
  checked,
  onChange,
}: Props) {
  return (
    <label className="flex items-center space-x-2">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
