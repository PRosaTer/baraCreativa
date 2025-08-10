import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { validatePassword, validateEmail } from "../../utils/validation";
import { registerUser } from "../../services/authService";
import { TipoUsuario } from '@/types/autenticacion';

interface RegisterFormData {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  confirmContrasena: string;
  numeroTelefono?: string;
  tipoUsuario: TipoUsuario;
  nombreEmpresa?: string;
  fotoPerfil?: string;
}

interface ErrorConMensaje extends Error {
  message: string;
}

export const useRegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombreCompleto: "",
    correoElectronico: "",
    contrasena: "",
    confirmContrasena: "",
    numeroTelefono: "",
    tipoUsuario: TipoUsuario.Alumno,
    nombreEmpresa: "",
    fotoPerfil: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

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
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(correoElectronico)) {
      Swal.fire(
        "Error",
        "Por favor, introduce un correo electrónico válido.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(contrasena)) {
      Swal.fire(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una mayúscula, un carácter especial y un número.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (contrasena !== confirmContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      nombreCompleto,
      correoElectronico,
      password: contrasena,
      telefono: numeroTelefono || undefined,
      tipoUsuario,
      nombreEmpresa: tipoUsuario === TipoUsuario.Empresa ? nombreEmpresa : undefined,
      fotoPerfil: fotoPerfil || undefined,
    };

    try {
      await registerUser(dataToSend);
      Swal.fire("Éxito", "Usuario registrado exitosamente", "success").then(() => {
        router.push("/login");
      });
    } catch (error) {
      const e = error as Partial<ErrorConMensaje>;
      Swal.fire(
        "Error",
        e.message || "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
    isSubmitting,
  };
};
