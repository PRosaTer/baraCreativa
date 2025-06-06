"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.status === 201) {
        const data = await response.json();

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setUser(data.user);

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión con éxito",
          text: `Bienvenido, ${data.user.email}!`,
          confirmButtonColor: "#3085d6",
        });

        // Redirigir según el rol
        const role = data.user.role;
        if (role === "admin" || role === "owner") {
          router.push("/adminProfile");
        } else if (role === "user") {
          router.push("/profile");
        }
        return;
      }

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas. Verifica tu email y contraseña.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(/bombillo-negro.png)`,
      }}
    >
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Inicia sesión
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-black">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col space-y-2 relative">
            <label className="text-sm font-medium text-black">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-velvet  bg-red-600 text-white relative overflow-hidden group z-10  hover:text-white duration-1000 rounded-[20px]"
          >
            Ingresar
          </button>
        </form>
        <div className="text-sm text-center mt-4 text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
