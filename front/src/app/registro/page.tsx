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
