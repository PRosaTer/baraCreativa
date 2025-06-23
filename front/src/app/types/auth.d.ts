export interface RegisterFormData {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  numeroTelefono: string;
  tipoUsuario: "Alumno" | "Empresa";
  nombreEmpresa: string;
  fotoPerfil: string;
  confirmContrasena: string;
}

export interface RegisterApiData {
  nombreCompleto: string;
  correoElectronico: string;
  password: string;
  telefono?: string;
  tipoUsuario: "Alumno" | "Empresa";
  nombreEmpresa?: string | null;
  fotoPerfil?: string | null;
}

export interface UserResponseData {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: "Alumno" | "Empresa";
  fechaRegistro?: string;
  estadoCuenta?: string;
}

export interface ApiResponse {
  message: string;
  user?: UserResponseData;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono?: string;
  tipoUsuario: "Alumno" | "Empresa" | "Admin";
  estadoCuenta: "activo" | "inactivo" | "bloqueado";
  ultimaSesion?: string;
  esAdmin: boolean;
  fotoPerfil?: string | null;
}
