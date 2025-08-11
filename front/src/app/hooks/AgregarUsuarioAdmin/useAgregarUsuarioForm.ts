"use client";

import { useState } from "react";

export default function useAgregarUsuarioForm(onUsuarioCreado: () => void) {
  const [form, setForm] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    tipoUsuario: "Alumno",
    nombreEmpresa: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }


    if (!form.nombreCompleto.trim() || !form.correoElectronico.trim()) {
      setError("Nombre completo y correo electrónico son obligatorios");
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append("nombreCompleto", form.nombreCompleto);
      formData.append("correoElectronico", form.correoElectronico);
      formData.append("password", form.password);
      formData.append("telefono", form.telefono);
      formData.append("tipoUsuario", form.tipoUsuario);
      formData.append("nombreEmpresa", form.nombreEmpresa);

      if (foto) {
        formData.append("fotoPerfil", foto);
      }

      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Error al crear usuario";
        try {
          const data = await res.json();
          if (data.message) msg = data.message;
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      setForm({
        nombreCompleto: "",
        correoElectronico: "",
        password: "",
        confirmPassword: "",
        telefono: "",
        tipoUsuario: "Alumno",
        nombreEmpresa: "",
      });
      setFoto(null);

      onUsuarioCreado();
      alert("Usuario creado con éxito");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setCargando(false);
    }
  };

  return {
    form,
    foto,
    cargando,
    error,
    setFoto,
    handleChange,
    handleSubmit,
  };
}
