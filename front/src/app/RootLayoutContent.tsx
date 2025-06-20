"use client";

import React from 'react';
import Navbar from "../components/Navbar/navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

interface RootLayoutContentProps {
  children: React.ReactNode;
}


const NavbarWithKey = () => {
  const { usuario, cargandoUsuario } = useAuth();
  const navbarKey = cargandoUsuario ? "navbar-loading" : (usuario ? `navbar-user-${usuario.id}` : "navbar-guest");

  return <Navbar key={navbarKey} />;
}

export default function RootLayoutContent({ children }: RootLayoutContentProps) {
  return (
    <AuthProvider>
      <NavbarWithKey /> 
      <main className="flex-grow">
        {children}
      </main>
    </AuthProvider>
  );
}