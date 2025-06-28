"use client";

import React from 'react';

interface Props {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export default function FormContainer({ onSubmit, children }: Props) {
  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6" encType="multipart/form-data">
      {children}
    </form>
  );
}
