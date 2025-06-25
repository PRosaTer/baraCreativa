"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAutenticacion } from '@/app/hooks/usarAutenticacion';

interface UsuarioAutenticado {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
  telefono?: string;
  tipoUsuario?: string;
  nombreEmpresa?: string;
  fotoPerfil?: string;
  estadoCuenta?: string;
  esAdmin: boolean;
  creadoEn: string;
  actualizadoEn: string;
  ultimaSesion?: string;
}

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  usuarioLogueado?: UsuarioAutenticado | null;
  cargandoUsuario: boolean;
  cerrarSesion: () => void | Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { usuario, cargandoUsuario, cerrarSesion, token } = useAutenticacion();

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuarioLogueado: usuario,
        cargandoUsuario,
        cerrarSesion,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
