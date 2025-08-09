'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface DatosContacto {
  correo: string;
  tipoConsulta: 'Técnica' | 'Administrativa' | 'Académica';
  mensaje: string;
}

interface UsuarioAutenticado {
  correoElectronico: string;
}

export const useSoporte = () => {
  const [datosContacto, setDatosContacto] = useState<DatosContacto>({
    correo: '',
    tipoConsulta: 'Técnica',
    mensaje: '',
  });
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<UsuarioAutenticado | null>(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const router = useRouter();

  const obtenerDatosUsuario = async (): Promise<UsuarioAutenticado | null> => {
    try {
      const respuesta = await fetch(`/api/auth/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!respuesta.ok) {
        return null;
      }

      const userData: UsuarioAutenticado = await respuesta.json();
      return userData;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      setCargandoUsuario(true);
      const user = await obtenerDatosUsuario();
      setUsuarioAutenticado(user);
      if (user) {
        setDatosContacto((prev) => ({ ...prev, correo: user.correoElectronico }));
      }
      setCargandoUsuario(false);
    };

    cargarUsuario();
  }, []);

  const manejarCambioContacto = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDatosContacto((prev) => ({ ...prev, [name]: value }));
  };

  const validarCorreo = (correo: string) => {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
  };

  const manejarContacto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { correo, tipoConsulta, mensaje } = datosContacto;

    if (!validarCorreo(correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, introduce un correo electrónico válido.',
        confirmButtonColor: '#ef4444', // Red-600
      });
      return;
    }

    if (mensaje.trim().length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El mensaje debe tener al menos 10 caracteres.',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    const datosAEnviar = {
      correo,
      tipo_consulta: tipoConsulta,
      mensaje,
      fecha_mensaje: new Date().toISOString(),
      estado_caso: 'Pendiente',
    };

    try {
      const respuesta = await fetch(`/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            errorData.message ||
            'Error al enviar la consulta. Intenta de nuevo más tarde.',
          confirmButtonColor: '#ef4444',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Consulta enviada exitosamente.',
        confirmButtonColor: '#eab308', // Yellow-500
      }).then(() => {
        setDatosContacto({
          correo: usuarioAutenticado ? usuarioAutenticado.correoElectronico : '',
          tipoConsulta: 'Técnica',
          mensaje: '',
        });
        router.push('/contacto');
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return {
    datosContacto,
    usuarioAutenticado,
    cargandoUsuario,
    manejarCambioContacto,
    manejarContacto,
  };
};
