"use client";

import React, { useState } from "react";

const SolicitarReset: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch("http://localhost:3001/password/solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correoElectronico: correo }),
      });

      const data = await respuesta.json();

     if (!respuesta.ok) {
  setError(data.message || "Error al solicitar recuperación");
  return;
}

localStorage.setItem("correoRecuperacion", correo);
setMensaje(data.mensaje);
setCorreo("");

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      <form onSubmit={manejarSubmit} className="space-y-4">
        <label className="block font-medium">Correo electrónico</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar enlace
        </button>
      </form>
      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default SolicitarReset;
