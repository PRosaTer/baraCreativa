import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface DatosInicioSesion {
    correo: string;
    contrasena: string;
}

interface DatosRegistro {
    nombreCompleto: string;
    correoElectronico: string;
    contrasena: string;
    numeroTelefono: string;
    tipoUsuario: "Alumno" | "Empresa";
    nombreEmpresa: string;
    fotoPerfil: string;
    confirmContrasena: string;
}

export const useAutenticacion = () => {
    const [datosInicioSesion, setDatosInicioSesion] = useState<DatosInicioSesion>({
        correo: "",
        contrasena: "",
    });

    const [datosRegistro, setDatosRegistro] = useState<DatosRegistro>({
        nombreCompleto: "",
        correoElectronico: "",
        contrasena: "",
        numeroTelefono: "",
        tipoUsuario: "Alumno",
        nombreEmpresa: "",
        fotoPerfil: "",
        confirmContrasena: "",
    });

    const router = useRouter();

    const manejarCambioInicioSesion = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatosInicioSesion((prev) => ({ ...prev, [name]: value }));
    };

    const manejarCambioRegistro = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setDatosRegistro((prev) => ({ ...prev, [name]: value }));
    };

    const validarContrasena = (contrasena: string) => {
        const regexContrasena =
            /^(?=.*[A-Z])(?=.*[!@#$%^&])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
        return regexContrasena.test(contrasena);
    };

    const validarCorreo = (correo: string) => {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexCorreo.test(correo);
    };

    const manejarInicioSesion = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const respuesta = await fetch(`${API_URL}/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosInicioSesion),
            });

            if (respuesta.status === 201) {
                const datos = await respuesta.json();
                localStorage.setItem("usuario", JSON.stringify(datos.user));
                localStorage.setItem("token", datos.token);
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: `¡Bienvenido, ${datos.user.email}!`,
                    confirmButtonColor: "#3085d6",
                });

                const rol = datos.user.role;
                if (rol === "admin" || rol === "owner") {
                    router.push("/adminProfile");
                } else if (rol === "user") {
                    router.push("/profile");
                }
                return;
            }

            throw new Error("Credenciales incorrectas");
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Credenciales incorrectas. Verifica tu correo y contraseña.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return { datosInicioSesion, manejarInicioSesion };
};
