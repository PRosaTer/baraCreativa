import { Result } from 'postcss';


type ResultadoRestablecimiento = { mensaje?: string; error?: string };

/**
 * Función para solicitar el restablecimiento de contraseña.
 * Envía el correo electrónico del usuario al backend.
 *
 * @param email El correo electrónico del usuario.
 * @returns Un objeto con un mensaje de éxito o un mensaje de error.
 */
export async function solicitarRestablecimientoPassword(email: string): Promise<ResultadoRestablecimiento> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password/solicitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correoElectronico: email }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al solicitar el restablecimiento.';
      return { error: errorMessage };
    }


    return { mensaje: data.message };
  } catch (error: unknown) {
    console.error('Error de red al solicitar restablecimiento:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}

/**
 * Función para confirmar el restablecimiento de contraseña.
 * Envía el token de recuperación y la nueva contraseña al backend.
 *
 * @param token El token de recuperación.
 * @param password La nueva contraseña.
 * @returns Un objeto con un mensaje de éxito o un mensaje de error.
 */
export async function confirmarRestablecimientoPassword(token: string, password: string): Promise<ResultadoRestablecimiento> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password/confirmar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al restablecer la contraseña.';
      return { error: errorMessage };
    }

    return { mensaje: data.message };
  } catch (error: unknown) {
    console.error('Error de red al confirmar restablecimiento:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}
