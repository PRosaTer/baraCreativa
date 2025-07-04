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
  cargandoUsuario: boolean;
  cerrarSesion: () => void | Promise<void>;
  mensajeExito: boolean;
  setMensajeExito: React.Dispatch<React.SetStateAction<boolean>>;
  manejarInicioSesion: (e: React.FormEvent, correo: string, contrasena: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    usuario,
    cargandoUsuario,
    cerrarSesion,
    mensajeExito,
    setMensajeExito,
    manejarInicioSesion,
  } = useAutenticacion();

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoUsuario,
        cerrarSesion,
        mensajeExito,
        setMensajeExito,
        manejarInicioSesion,
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
