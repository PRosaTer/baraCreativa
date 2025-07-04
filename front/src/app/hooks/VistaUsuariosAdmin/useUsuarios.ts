"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/app/context/SocketProvider";
import { Usuario } from "@/app/types/auth";

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const socket = useSocket();

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/admin/users`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error(await res.text());

      const data: Usuario[] = await res.json();
      data.sort((a, b) => a.id - b.id);
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const actualizar = (usuariosActualizados: Usuario[]) => {
      usuariosActualizados.sort((a, b) => a.id - b.id);
      setUsuarios(usuariosActualizados);
    };

    socket.on("usuariosActualizados", actualizar);
    return () => {
      socket.off("usuariosActualizados", actualizar);
    };
  }, [socket]);

  const actualizarUsuarioEnLista = (actualizado: Usuario) => {
    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
  };

  return {
    usuarios,
    actualizarUsuarioEnLista,
    fetchUsuarios,
  };
}
