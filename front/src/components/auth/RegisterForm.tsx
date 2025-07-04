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
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
  } = useRegisterForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-900 to-teal-900 overflow-hidden">
      <div className="flex w-full max-w-6xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden">
        {/* Imagen a la izquierda con bombillo */}
        <div
          className="w-1/2 bg-cover bg-center bg-gray-950"
          style={{ backgroundImage: 'url("/bombillo-blanco.png")' }}
        ></div>

        {/* Formulario a la derecha */}
        <div className="w-1/2 bg-gray-900 p-8 flex flex-col justify-center space-y-6">
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

          <InputTexto
            name="nombreCompleto"
            placeholder="Nombre Completo"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
          />

          <InputTexto
            name="correoElectronico"
            type="email"
            placeholder="Correo Electrónico"
            value={formData.correoElectronico}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
          />

          <InputTexto
            name="numeroTelefono"
            placeholder="Teléfono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
          />

          <SelectTipoUsuario
            value={formData.tipoUsuario}
            onChange={handleChange}
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
          />

          {formData.tipoUsuario === "Empresa" && (
            <InputTexto
              name="nombreEmpresa"
              placeholder="Nombre de la Empresa"
              value={formData.nombreEmpresa}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02]"
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
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02] pr-10 relative"
          />

          <InputPassword
            name="confirmContrasena"
            placeholder="Confirmar Contraseña"
            value={formData.confirmContrasena}
            onChange={handleChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            required
            className="w-full p-3 border-2 border-red-500/70 rounded-lg bg-gray-800 text-white placeholder-yellow-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 disabled:bg-gray-600/50 disabled:cursor-not-allowed hover:bg-gray-700 hover:scale-[1.02] pr-10 relative"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-900 text-yellow-300 py-3 rounded hover:bg-yellow-500 hover:text-indigo-900 transition"
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
