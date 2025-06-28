import { useState } from "react";
import { solicitarRestablecimientoPassword } from "@/app/lib/service/auth";

export const useResetPassword = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const data = await solicitarRestablecimientoPassword(correo);

      if (data.error) {
        setError(data.error ?? "Error desconocido al solicitar recuperación.");
        return;
      }

      setMensaje(data.mensaje ?? "Enlace de recuperación enviado correctamente.");
      setCorreo("");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return {
    correo,
    setCorreo,
    mensaje,
    error,
    manejarSubmit,
  };
};
