'use client';

import React from "react";

interface Props {
  id: string;
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFlotante({
  id,
  label,
  value,
  type = "text",
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="relative z-0 w-full group">
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 appearance-none
          focus:outline-none focus:ring-0 focus:border-yellow-400
          peer ${disabled ? "border-gray-600 cursor-not-allowed" : "border-yellow-400"}`}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100
          peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-yellow-400"
      >
        {label}
      </label>
    </div>
  );
}
