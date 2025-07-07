"use client";

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
      className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: 'url("/bombillo-blanco.png")',
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-950 w-full max-w-md p-8 rounded-2xl shadow-2xl transform transition-all duration-300 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-red-600 mb-6 drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)] animate-pulse">
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

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="nombreCompleto"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Nombre Completo
            <span className="text-red-500 ml-1">*</span>
          </label>
          <InputTexto
            name="nombreCompleto"
            placeholder="Nombre Completo"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="correoElectronico"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Correo Electrónico
            <span className="text-red-500 ml-1">*</span>
          </label>
          <InputTexto
            name="correoElectronico"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.correoElectronico}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="numeroTelefono"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Teléfono
          </label>
          <InputTexto
            name="numeroTelefono"
            placeholder="Teléfono"
            value={formData.numeroTelefono}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="tipoUsuario"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Tipo de Usuario
            <span className="text-red-500 ml-1">*</span>
          </label>
          <SelectTipoUsuario
            value={formData.tipoUsuario}
            onChange={handleChange}
          />
        </div>

        {formData.tipoUsuario === "Empresa" && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="nombreEmpresa"
              className="block font-bold text-yellow-400 drop-shadow-md"
            >
              Nombre de la Empresa
              <span className="text-red-500 ml-1">*</span>
            </label>
            <InputTexto
              name="nombreEmpresa"
              placeholder="Nombre de la Empresa"
              value={formData.nombreEmpresa}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="contrasena"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Contraseña
            <span className="text-red-500 ml-1">*</span>
          </label>
          <InputPassword
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="confirmContrasena"
            className="block font-bold text-yellow-400 drop-shadow-md"
          >
            Confirmar Contraseña
            <span className="text-red-500 ml-1">*</span>
          </label>
          <InputPassword
            name="confirmContrasena"
            placeholder="Confirmar Contraseña"
            value={formData.confirmContrasena}
            onChange={handleChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            required
          />
        </div>

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
