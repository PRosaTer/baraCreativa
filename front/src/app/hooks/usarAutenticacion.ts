import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DatosInicioSesion {
    correo: string;
    contrasena: string;
}

export const useAutenticacion = () => {
    const [datosInicioSesion, setDatosInicioSesion] = useState<DatosInicioSesion>({
        correo: "",
        contrasena: "",
    });
    const router = useRouter();

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatosInicioSesion((prev) => ({ ...prev, [name]: value }));
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

    return { datosInicioSesion, manejarCambio, manejarInicioSesion };
};