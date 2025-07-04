import { useState } from 'react';
import { solicitarRestablecimientoPassword } from '@/app/lib/service/auth';

export const useResetPassword = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCargando(true);

    try {
      const result = await solicitarRestablecimientoPassword(correo);

      if (result.error) {
        setError(result.error);
      } else if (result.mensaje) {
        setMensaje(result.mensaje);
        setCorreo('');
      }
    } catch (err) {
      console.error('Error en el hook useResetPassword:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return {
    correo,
    setCorreo,
    mensaje,
    error,
    manejarSubmit,
    cargando,
  };
};