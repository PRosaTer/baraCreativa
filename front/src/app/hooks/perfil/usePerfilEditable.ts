import { useState, useEffect } from "react";
import { Usuario } from "@/types/auth";

export function usePerfilEditable(usuario: Usuario) {
  const [telefono, setTelefono] = useState(usuario.telefono || "");
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | undefined>(
    usuario.fotoPerfil
      ? `http://localhost:3001/uploads/perfiles/${usuario.fotoPerfil}`
      : undefined
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  const [estadoInicial, setEstadoInicial] = useState({
    telefono: usuario.telefono || "",
    fotoPerfilUrl: previewFoto,
  });

  useEffect(() => {
    if (!fotoPerfil) return;
    const url = URL.createObjectURL(fotoPerfil);
    setPreviewFoto(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoPerfil]);

  return {
    telefono,
    setTelefono,
    fotoPerfil,
    setFotoPerfil,
    previewFoto,
    setPreviewFoto,
    guardando,
    setGuardando,
    error,
    setError,
    editando,
    setEditando,
    estadoInicial,
    setEstadoInicial,
  };
}
