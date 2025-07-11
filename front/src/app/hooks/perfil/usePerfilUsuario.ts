"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Usuario } from "@/app/types/auth";

export const usePerfilUsuario = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setMensajeError("No autorizado. Debes iniciar sesión para acceder.");
          setTimeout(() => {
            router.push("/login");
          }, 4000);
          return;
        }

        const data: Usuario = await res.json();
        setUsuario(data);
        setMensajeError(null);
      } catch (error) {
        setMensajeError("Error desconocido al obtener perfil.");
        setTimeout(() => {
          router.push("/login");
        }, 4000);
      }
    };

    obtenerPerfil();
  }, [router]);

  return { usuario, setUsuario, mensajeError };
};
