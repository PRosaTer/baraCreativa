type ResultadoAuth = { token?: string; error?: string };
type ResultadoRegistro = { mensaje?: string; error?: string };
type ResultadoRestablecimiento = { mensaje?: string; error?: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Función para iniciar sesión de un usuario.
 * @param email El correo electrónico del usuario.
 * @param password La contraseña del usuario.
 * @returns Un objeto con un token de autenticación o un mensaje de error.
 */
export async function login(email: string, password: string): Promise<ResultadoAuth> {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al iniciar sesión.';
      return { error: errorMessage };
    }

    return { token: data.accessToken };
  } catch (error: unknown) {
    console.error('Error de red al iniciar sesión:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}

/**
 * Función para registrar un nuevo usuario.
 * @param datosRegistro Los datos del usuario para el registro.
 * @returns Un objeto con un mensaje de éxito o un mensaje de error.
 */
export async function register(datosRegistro: Object): Promise<ResultadoRegistro> {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRegistro),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Error desconocido al registrar usuario.';
      return { error: errorMessage };
    }

    return { mensaje: data.message };
  } catch (error: unknown) {
    console.error('Error de red al registrar usuario:', error);
    return { error: 'Error de conexión con el servidor.' };
  }
}

/**
 * Función para solicitar el restablecimiento de contraseña.
 * @param email El correo electrónico del usuario.
 * @returns Un objeto con un mensaje de éxito o un mensaje de error.
 */
export async function solicitarRestablecimientoPassword(email: string): Promise<ResultadoRestablecimiento> {
  try {
    const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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
 * @param token El token de recuperación.
 * @param password La nueva contraseña.
 * @returns Un objeto con un mensaje de éxito o un mensaje de error.
 */
export async function confirmarRestablecimientoPassword(token: string, password: string): Promise<ResultadoRestablecimiento> {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
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
