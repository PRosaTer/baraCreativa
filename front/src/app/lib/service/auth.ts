// src/lib/services/auth.ts

interface PasswordResetResponse {
  mensaje?: string;
  error?: string;
}

export async function confirmarRestablecimientoPassword(
  token: string,
  password: string
): Promise<PasswordResetResponse> {
  const url = "http://localhost:3001/password/confirmar";
  
  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    return { error: data.message || "Error al restablecer la contraseña" };
  }

  return { mensaje: data.mensaje };
}

export async function solicitarRestablecimientoPassword(
  correoElectronico: string
): Promise<PasswordResetResponse> {
  const url = "http://localhost:3001/password/solicitar";

  const respuesta = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correoElectronico }),
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    return { error: data.message || "Error al solicitar recuperación" };
  }

  return { mensaje: data.mensaje };
}