"use client";

import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import SelectorFotoPerfil from "@/components/ui/SelectorFotoPerfil";

interface Props {
  form: any;
  foto: File | null;
  setFoto: (file: File | null) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function CamposFormularioUsuario({
  form,
  setFoto,
  handleChange,
}: Props) {
  return (
    <>
      <SelectorFotoPerfil onFotoChange={setFoto} />

      <InputField
        name="nombreCompleto"
        placeholder="Nombre Completo"
        value={form.nombreCompleto}
        onChange={handleChange}
        required
      />

      <InputField
        name="correoElectronico"
        type="email"
        placeholder="Correo Electrónico"
        value={form.correoElectronico}
        onChange={handleChange}
        required
      />

      <InputField
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />

      <SelectField
        name="tipoUsuario"
        value={form.tipoUsuario}
        onChange={handleChange}
        options={["Alumno", "Instructor", "Empresa", "Admin"]}
      />

      {form.tipoUsuario === "Empresa" && (
        <InputField
          name="nombreEmpresa"
          placeholder="Nombre de la Empresa"
          value={form.nombreEmpresa}
          onChange={handleChange}
          required
        />
      )}

      <InputField
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />

      <InputField
        name="confirmPassword"
        type="password"
        placeholder="Confirmar Contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
    </>
  );
}
