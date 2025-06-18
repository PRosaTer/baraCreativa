"use client";

import React, { useState } from "react";

export default function SolicitarRecuperacion() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch("http://localhost:3001/password/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correoElectronico: correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al solicitar recuperación");
        return;
      }

      setMensaje(data.mensaje || "Revisa tu correo para continuar.");
      setCorreo("");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>
        <input
          type="email"
          placeholder="Tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
          Enviar enlace
        </button>
        {mensaje && <p className="mt-4 text-center text-sm text-green-600">{mensaje}</p>}
        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
