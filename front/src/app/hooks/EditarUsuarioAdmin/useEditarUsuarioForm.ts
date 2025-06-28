"use client";

import { useState, useEffect } from "react";
import { Usuario } from "../../types/auth";

export default function useEditarUsuarioForm(usuario: Usuario | null) {
  const [form, setForm] = useState<Usuario | null>(usuario);

  useEffect(() => {
    setForm(usuario);
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return {
    form,
    setForm,
    handleChange,
  };
}
