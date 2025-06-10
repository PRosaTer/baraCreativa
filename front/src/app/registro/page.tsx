"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    dni: "",
    DOB: "",
    civilStatus: "",
    employmentStatus: "",
    password: "",
    confirmPassword: "",
    role: "user",
    photo: "",
  });
  const [showpassword, setShowpassword] = useState(false);
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { password, confirmPassword, DOB } = formData;

    if (formData.name.length < 2 || formData.lastName.length < 2) {
      alert("El nombre y el apellido deben tener al menos 2 caracteres.");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const formDataWithNumbers = {
      ...formData,
      DOB: DOB.toString(),
    };

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithNumbers),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        throw new Error("Error al registrar al usuario");
      }

      const data = await response.json();
      console.log("Usuario registrado exitosamente:", data);

      Swal.fire("Éxito", "Usuario registrado exitosamente", "success").then(
        () => {
          router.push("/login");
        }
      );
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden"
      style={{
        backgroundImage: `url(/bombillo-negro.png)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300"
      >
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-800"
          >
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-800"
          >
            Apellido
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-gray-800"
          >
            Nacionalidad
          </label>
          <input
            type="text"
            name="nationality"
            id="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="DOB"
            className="block text-sm font-medium text-gray-800"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="DOB"
            id="DOB"
            value={formData.DOB}
            onChange={handleChange}
            className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showpassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowpassword(!showpassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
            >
              {showpassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-800"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showpassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowpassword(!showpassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition duration-200"
            >
              {showpassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
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
