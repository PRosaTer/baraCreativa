'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UsuarioAutenticado {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono?: string;
  tipoUsuario?: string;
  nombreEmpresa?: string;
  fotoPerfil?: string;
  estadoCuenta?: string;
  esAdmin: boolean;
  creadoEn: string;
  actualizadoEn: string;
  ultimaSesion?: string;
}

export const useAutenticacion = () => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(false);
  const router = useRouter();



  const obtenerDatosUsuario = useCallback(async (): Promise<UsuarioAutenticado | null> => {
    try {
      const respuesta = await fetch(`/api/auth/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          setUsuario(null);
        }
        return null;
      }

      const userData: UsuarioAutenticado = await respuesta.json();
      return userData;
    } catch (error) {
      setUsuario(null);
      return null;
    }
  }, []);

  const manejarInicioSesion = async (
    e: React.FormEvent,
    correo: string,
    contrasena: string
  ): Promise<boolean> => {
    e.preventDefault();

    try {
      const respuesta = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          correoElectronico: correo,
          password: contrasena,
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        console.error(errorData.message || 'Error al iniciar sesión');
        return false;
      }

      const usuarioLogeado = await obtenerDatosUsuario();

      if (usuarioLogeado) {
        setUsuario(usuarioLogeado);
        setMensajeExito(true);
        router.push('/');
        return true;
      } else {
        console.error('Inicio de sesión exitoso, pero no se pudo obtener el perfil.');
        return false;
      }
    } catch (error) {
      console.error('Error al conectar con el servidor o iniciar sesión.', error);
      return false;
    }
  };

  const cerrarSesion = useCallback(async () => {
    try {
      await fetch(`/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }

    setUsuario(null);
    setMensajeExito(false);
    router.push('/login');
    router.refresh();
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      setCargandoUsuario(true);
      const user = await obtenerDatosUsuario();
      setUsuario(user);
      setCargandoUsuario(false);
    };

    loadUser();
  }, [obtenerDatosUsuario]);

  return {
    usuario,
    cargandoUsuario,
    mensajeExito,
    setMensajeExito,
    manejarInicioSesion,
    cerrarSesion,
  };
};
