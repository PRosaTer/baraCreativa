"use client";

import React, { useState, useEffect, Suspense } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { confirmarRestablecimientoPassword } from '@/app/lib/service/auth';


const RestablecerPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [validando, setValidando] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("El enlace es inválido o ha expirado.");
      setValidando(false);
    } else {
      setValidando(false);
    }
  }, [token]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const data = await confirmarRestablecimientoPassword(token, password);

      if (data.error) {
        setError(data.error ?? "Error desconocido al restablecer la contraseña.");
        return;
      }

      setMensaje(data.mensaje ?? "Contraseña restablecida correctamente.");
      setPassword("");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  if (validando) return <p>Validando token...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}
      {!mensaje && (
        <form onSubmit={manejarSubmit} className="space-y-4">
          <label className="block font-medium">Nueva contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-2 border rounded"
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Restablecer
          </button>
        </form>
      )}
    </div>
  );
};


const RestablecerPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RestablecerPasswordContent />
    </Suspense>
  );
};

export default RestablecerPasswordPage;
