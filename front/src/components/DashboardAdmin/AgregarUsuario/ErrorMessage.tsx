"use client";

import React from 'react';

interface Props {
  mensaje: string | null;
}

export default function ErrorMessage({ mensaje }: Props) {
  if (!mensaje) return null;
  return <div className="text-red-600 font-semibold text-center">{mensaje}</div>;
}
