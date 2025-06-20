"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DatosInicioSesion {
  correo: string;
  contrasena: string;
}

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
  const [datosInicioSesion, setDatosInicioSesion] = useState<DatosInicioSesion>({
    correo: "",
    contrasena: "",
  });

  const [mensajeExito, setMensajeExito] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const router = useRouter();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosInicioSesion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const obtenerDatosUsuario = useCallback(async (token: string): Promise<UsuarioAutenticado | null> => {
    if (!token) {
      setUsuario(null);
      return null;
    }
    try {
      const respuesta = await fetch("http://localhost:3001/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          localStorage.removeItem("token");
          setUsuario(null);
        }
        return null;
      }

      const userData: UsuarioAutenticado = await respuesta.json();
      return userData;

    } catch (error) {
      localStorage.removeItem("token");
      setUsuario(null);
      return null;
    }
  }, []); 

  const manejarInicioSesion = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correoElectronico: datosInicioSesion.correo,
          password: datosInicioSesion.contrasena,
        }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        alert(errorData.message || "Error al iniciar sesión");
        return false;
      }

      const data = await respuesta.json();
      const token = data.access_token;
      localStorage.setItem("token", token);

      const usuarioLogeado = await obtenerDatosUsuario(token);
      if (usuarioLogeado) {
        setMensajeExito(true);

        window.location.href = '/'; 
        
        return true;
      } else {
        alert("Inicio de sesión exitoso, pero no se pudieron cargar los datos del usuario. Intente recargar la página.");
        localStorage.removeItem("token");
        return false;
      }

    } catch (error) {
      alert("Error al conectar con el servidor o al iniciar sesión.");
      return false;
    }
  };

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("token");
    setUsuario(null); 
    setMensajeExito(false);
    router.push("/"); 
    router.refresh(); 
  }, [router]);

  useEffect(() => {
    const loadUserFromToken = async () => {
      setCargandoUsuario(true);
      const token = localStorage.getItem("token");
      const loadedUser = await obtenerDatosUsuario(token || ''); 
      setUsuario(loadedUser);
      setCargandoUsuario(false);
    };

    loadUserFromToken(); 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === null) { 
        loadUserFromToken();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [obtenerDatosUsuario]); 

  useEffect(() => {
  }, [usuario, cargandoUsuario]);

  return {
    datosInicioSesion,
    manejarCambio,
    manejarInicioSesion,
    mensajeExito,
    setMensajeExito,
    usuario,
    cargandoUsuario,
    cerrarSesion,
  };
};