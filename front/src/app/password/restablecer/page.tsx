"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const RestablecerPassword: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [validandoToken, setValidandoToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("El enlace es inválido o ha expirado.");
      setValidandoToken(false);
    } else {
      setValidandoToken(false);
    }
  }, [token]);

  const manejarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (password !== confirmacion) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/password/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al restablecer la contraseña");
        return;
      }

      setMensaje(data.mensaje);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  if (validandoToken) return <p>Validando token...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Restablecer contraseña</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

      {!mensaje && !error && (
        <form onSubmit={manejarSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
            minLength={6}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Restablecer contraseña
          </button>
        </form>
      )}
    </div>
  );
};

export default RestablecerPassword;
