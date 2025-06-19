"use client";

import { useRegisterForm } from "../../app/hooks/auth/useRegisterForm";
import FormField from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import SelectInput from "@/components/ui/SelectInput";

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
        className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Regístrate
        </h2>

        <FormField
          label="Nombre Completo"
          id="nombreCompleto"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleChange}
          required
        />

        <FormField
          label="Correo Electrónico"
          id="correoElectronico"
          name="correoElectronico"
          type="email"
          value={formData.correoElectronico}
          onChange={handleChange}
          required
        />

        <FormField
          label="Número de Teléfono"
          id="numeroTelefono"
          name="numeroTelefono"
          type="tel"
          value={formData.numeroTelefono}
          onChange={handleChange}
          placeholder="Ej: +549341xxxxxxx"
        />

        <SelectInput
          label="Tipo de Usuario"
          id="tipoUsuario"
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onChange={handleChange}
          options={[
            { value: "Alumno", label: "Alumno" },
            { value: "Empresa", label: "Empresa" },
          ]}
          required
        />

        {formData.tipoUsuario === "Empresa" && (
          <FormField
            label="Nombre de la Empresa"
            id="nombreEmpresa"
            name="nombreEmpresa"
            value={formData.nombreEmpresa}
            onChange={handleChange}
            required
          />
        )}

        <PasswordInput
          label="Contraseña"
          id="contrasena"
          name="contrasena"
          value={formData.contrasena}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <PasswordInput
          label="Confirmar Contraseña"
          id="confirmContrasena"
          name="confirmContrasena"
          value={formData.confirmContrasena}
          onChange={handleChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <FormField
          label="URL de Foto de Perfil (Opcional)"
          id="fotoPerfil"
          name="fotoPerfil"
          type="url"
          value={formData.fotoPerfil}
          onChange={handleChange}
          placeholder="Ej: https://example.com/mi-foto.jpg"
        />

        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;