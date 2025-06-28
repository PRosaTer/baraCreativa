'use client';

import React from "react";
import SelectorFotoPerfil from "@/components/ui/SelectorFotoPerfil";
import { useRegisterForm } from "@/app/hooks/authRegistro/useRegisterForm";
import InputTexto from "./InputTexto";
import InputPassword from "./InputPassword";
import SelectTipoUsuario from "./SelectTipoUsuario";

const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
  } = useRegisterForm();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden"
      style={{
        backgroundImage: 'url("/bombillo-negro.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Regístrate
        </h2>

        <SelectorFotoPerfil
          fotoPerfilInicial={undefined}
          onFotoChange={(file) =>
            handleChange({
              target: { name: "fotoPerfil", value: file?.name || "" },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />

        <InputTexto
          name="nombreCompleto"
          placeholder="Nombre Completo"
          value={formData.nombreCompleto}
          onChange={handleChange}
          required
        />

        <InputTexto
          name="correoElectronico"
          type="email"
          placeholder="Correo Electrónico"
          value={formData.correoElectronico}
          onChange={handleChange}
          required
        />

        <InputTexto
          name="numeroTelefono"
          placeholder="Teléfono"
          value={formData.numeroTelefono}
          onChange={handleChange}
        />

        <SelectTipoUsuario
          value={formData.tipoUsuario}
          onChange={handleChange}
        />

        {formData.tipoUsuario === "Empresa" && (
          <InputTexto
            name="nombreEmpresa"
            placeholder="Nombre de la Empresa"
            value={formData.nombreEmpresa}
            onChange={handleChange}
            required
          />
        )}

        <InputPassword
          name="contrasena"
          placeholder="Contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
        />

        <InputPassword
          name="confirmContrasena"
          placeholder="Confirmar Contraseña"
          value={formData.confirmContrasena}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded hover:bg-red-600 transition"
        >
          {isSubmitting ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
