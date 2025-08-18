import { Result } from 'postcss';

type ResultadoRestablecimiento = { mensaje?: string; error?: string };

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
