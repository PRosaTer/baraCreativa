"use client";

import React from 'react';

interface Props {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export default function FormContainer({ onSubmit, children }: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto space-y-4">
      {children}
    </form>
  );
}
