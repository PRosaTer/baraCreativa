"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correoElectronico: "",
    contrasena: "",
    numeroTelefono: "",
    tipoUsuario: "Alumno",
    nombreEmpresa: "",
    fotoPerfil: "",
    confirmContrasena: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.[A-Z])(?=.[!@#$%^&])(?=.\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      nombreCompleto,
      correoElectronico,
      contrasena,
      confirmContrasena,
      numeroTelefono,
      tipoUsuario,
      nombreEmpresa,
      fotoPerfil,
    } = formData;

    if (nombreCompleto.length < 4) {
      Swal.fire(
        "Error",
        "El nombre completo debe tener al menos 4 caracteres.",
        "error"
      );
      return;
    }

    if (!validateEmail(correoElectronico)) {
      Swal.fire(
        "Error",
        "Por favor, introduce un correo electrónico válido.",
        "error"
      );
      return;
    }

    if (!validatePassword(contrasena)) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, un carácter especial y un número.",
        "error"
      );
      return;
    }

    if (contrasena !== confirmContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    const dataToSend = {
      nombre_completo: nombreCompleto,
      correo_electronico: correoElectronico,
      contrasena: contrasena,
      numero_telefono: numeroTelefono,
      tipo_usuario: tipoUsuario,
      nombre_empresa: tipoUsuario === "Empresa" ? nombreEmpresa : null,
      fecha_registro: new Date().toISOString(),
      foto_perfil: fotoPerfil || null,
    };

    console.log("Enviando datos al backend:", dataToSend);

    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error del backend:", errorData);
        Swal.fire(
          "Error",
          errorData.message ||
            "Error al registrar al usuario. Intenta de nuevo más tarde.",
          "error"
        );
        return;
      }

      const data = await response.json();
      console.log("Usuario registrado exitosamente:", data);

      Swal.fire("Éxito", "Usuario registrado exitosamente", "success").then(
        () => {
          router.push("/login");
        }
      );
    } catch (error) {
      console.error("Error en la solicitud de registro:", error);
      Swal.fire(
        "Error",
        "No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.",
        "error"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden"
      style={{
        backgroundImage: url(`/bombillo-negro.png`),
        backgroundSize: "contain",
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
        </div>

        <div className="mb-6">
          <label
            htmlFor="tipoUsuario"
            className="block text-sm font-medium text-gray-800"
          >
            Tipo de Usuario
          </label>
          <select
            name="tipoUsuario"
            id="tipoUsuario"
            value={formData.tipoUsuario}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          >
            <option value="Alumno">Alumno</option>
            <option value="Empresa">Empresa</option>
          </select>
        </div>

        {formData.tipoUsuario === "Empresa" && (
          <div className="mb-6">
            <label
              htmlFor="nombreEmpresa"
              className="block text-sm font-medium text-gray-800"
            >
              Nombre de la Empresa
            </label>
            <input
              type="text"
              name="nombreEmpresa"
              id="nombreEmpresa"
              value={formData.nombreEmpresa}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="contrasena"
            className="block text-sm font-medium text-gray-800"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="contrasena"
              id="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmContrasena"
            className="block text-sm font-medium text-gray-800"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmContrasena"
              id="confirmContrasena"
              value={formData.confirmContrasena}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="fotoPerfil"
            className="block text-sm font-medium text-gray-800"
          >
            URL de Foto de Perfil (Opcional)
          </label>
          <input
            type="url"
            name="fotoPerfil"
            id="fotoPerfil"
            value={formData.fotoPerfil}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Ej: https://example.com/mi-foto.jpg"
          />
        </div>

        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
