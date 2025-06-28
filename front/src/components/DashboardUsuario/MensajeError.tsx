import React from "react";

interface Props {
  mensaje: string | null;
}

export default function MensajeError({ mensaje }: Props) {
  if (!mensaje) return null;
  return <div className="text-red-500 font-semibold">{mensaje}</div>;
}
