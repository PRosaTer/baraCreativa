export enum TipoUsuario {
  Alumno = "Alumno",
  Empresa = "Empresa",
  Admin = "Admin",
  Instructor = "Instructor",
}

export interface RegisterFormData {
  nombreCompleto: string;
  correoElectronico: string;
  contrasena: string;
  confirmContrasena: string;
  numeroTelefono?: string;
  tipoUsuario: TipoUsuario;
  nombreEmpresa?: string;
  fotoPerfil?: string;
}

export interface RegisterApiData {
  nombreCompleto: string;
  correoElectronico: string;
  password: string;
  telefono?: string;
  tipoUsuario: TipoUsuario;
  nombreEmpresa?: string | null;
  fotoPerfil?: string | null;
}

export interface UserResponseData {
  id: string;
  nombreCompleto: string;
  correoElectronico: string;
  tipoUsuario: TipoUsuario;
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
  tipoUsuario: TipoUsuario | 'Admin' | 'Instructor';
  estadoCuenta: 'activo' | 'inactivo' | 'bloqueado';
  esAdmin: boolean;
  fotoPerfil?: string | null;
  ultimaSesion?: string;
  estaConectado: boolean;
}
