"use client";

import React from "react";
import ContenedorFormularioRegistro from "@/components/formularios/contenedorFormularioRegistro";
import CampoEntrada from "@/components/formularios/CampoEntrada";
import CampoContrasena from "@/components/formularios/CampoContrasena";
import CampoConfirmarContrasena from "@/components/formularios/CampoConfirmarContrasena";
import CampoSelector from "@/components/formularios/CampoSelector";
import BotonEnviar from "@/components/formularios/BotonEnviar";
import EnlaceFormulario from "@/components/formularios/EnlaceFormulario";
import { useAutenticacion } from "@/app/hooks/usarAutenticacion";

const Registro: React.FC = () => {
  const { datosRegistro, manejarCambioRegistro, manejarRegistro } =
    useAutenticacion();

  const opcionesTipoUsuario = [
    { valor: "Alumno", texto: "Alumno" },
    { valor: "Empresa", texto: "Empresa" },
  ];

  return (

    <ContenedorFormularioRegistro titulo="Regístrate">
      <form onSubmit={manejarRegistro} className="space-y-6">
        <CampoEntrada
          etiqueta="Nombre Completo"
          tipo="text"
          nombre="nombreCompleto"
          valor={datosRegistro.nombreCompleto}
          onChange={manejarCambioRegistro}
          requerido
        />
        <CampoEntrada
          etiqueta="Correo Electrónico"
          tipo="email"
          nombre="correoElectronico"
          valor={datosRegistro.correoElectronico}
          onChange={manejarCambioRegistro}
          requerido
        />
        <CampoEntrada
          etiqueta="Número de Teléfono"
          tipo="tel"
          nombre="numeroTelefono"
          valor={datosRegistro.numeroTelefono}
          onChange={manejarCambioRegistro}
          placeholder="Ej: +549341xxxxxxx"
        />
        <CampoSelector
          etiqueta="Tipo de Usuario"
          nombre="tipoUsuario"
          valor={datosRegistro.tipoUsuario}
          onChange={manejarCambioRegistro}
          opciones={opcionesTipoUsuario}
          requerido
        />
        {datosRegistro.tipoUsuario === "Empresa" && (
          <CampoEntrada
            etiqueta="Nombre de la Empresa"
            tipo="text"
            nombre="nombreEmpresa"
            valor={datosRegistro.nombreEmpresa}
            onChange={manejarCambioRegistro}
            requerido

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
        className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Regístrate
        </h2>

        <div className="mb-6">
          <label
            htmlFor="nombreCompleto"
            className="block text-sm font-medium text-gray-800"
          >
            Nombre Completo
          </label>
          <input
            type="text"
            name="nombreCompleto"
            id="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="correoElectronico"
            className="block text-sm font-medium text-gray-800"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            name="correoElectronico"
            id="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="numeroTelefono"
            className="block text-sm font-medium text-gray-800"
          >
            Número de Teléfono
          </label>
          <input
            type="tel"
            name="numeroTelefono"
            id="numeroTelefono"
            value={formData.numeroTelefono}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Ej: +549341xxxxxxx"

          />
        )}
        <CampoContrasena
          etiqueta="Contraseña"
          nombre="contrasena"
          valor={datosRegistro.contrasena}
          onChange={manejarCambioRegistro}
          requerido
        />
        <CampoConfirmarContrasena
          etiqueta="Confirmar Contraseña"
          nombre="confirmContrasena"
          valor={datosRegistro.confirmContrasena}
          onChange={manejarCambioRegistro}
          requerido
        />
        <CampoEntrada
          etiqueta="URL de Foto de Perfil (Opcional)"
          tipo="url"
          nombre="fotoPerfil"
          valor={datosRegistro.fotoPerfil}
          onChange={manejarCambioRegistro}
          placeholder="Ej: https://example.com/mi-foto.jpg"
        />
        <BotonEnviar texto="Registrar" />
      </form>
      <div className="text-sm text-center mt-6 text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <EnlaceFormulario texto="Inicia sesión" href="/login" />
      </div>
    </ContenedorFormularioRegistro>
  );
};

export default Registro;
