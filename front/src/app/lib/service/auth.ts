const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


export async function solicitarRestablecimientoPassword(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al solicitar el restablecimiento.';
      return { error: errorMessage };
    }

    return { mensaje: data.message };
  } catch (error) {
    console.error('Error de red al solicitar restablecimiento:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}


export async function confirmarRestablecimientoPassword(token: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al restablecer la contraseña.';
      return { error: errorMessage };
    }

    return { mensaje: data.message };
  } catch (error) {
    console.error('Error de red al confirmar restablecimiento:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}