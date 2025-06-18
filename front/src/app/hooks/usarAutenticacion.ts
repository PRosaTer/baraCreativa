import { useState } from "react";
import { useRouter } from "next/navigation";

interface DatosInicioSesion {
  correo: string;
  contrasena: string;
}

export const useAutenticacion = () => {
  const [datosInicioSesion, setDatosInicioSesion] = useState<DatosInicioSesion>({
    correo: "",
    contrasena: "",
  });

  const [mensajeExito, setMensajeExito] = useState(false);

  const router = useRouter();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosInicioSesion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarInicioSesion = async (e: React.FormEvent<HTMLFormElement>) => {
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
        return;
      }

      const data = await respuesta.json();

      localStorage.setItem("token", data.access_token);

      setMensajeExito(true);

      setTimeout(() => {
        setMensajeExito(false);
        router.push("/");
      }, 2500);

    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error(error);
    }
  };

  return {
    datosInicioSesion,
    manejarCambio,
    manejarInicioSesion,
    mensajeExito,
    setMensajeExito,
  };
};
