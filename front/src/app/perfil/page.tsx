'use client';

import React, { useEffect, useState } from 'react';
import MenuAdmin from '@/components/DashboardAdmin/MenuAdmin';
import VistaUsuarios from '@/components/DashboardAdmin/VistaUsuarios';
import VistaCursos from '@/components/DashboardAdmin/VistaCursos';
import AgregarUsuario from '@/components/DashboardAdmin/AgregarUsuario';
import PerfilUsuario from '@/components/DashboardUsuario/PerfilUsuario';
import { Usuario } from '@/app/types/auth';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vista, setVista] = useState<'usuarios' | 'cursos' | 'agregarUsuario'>('usuarios');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const obtenerPerfil = async () => {
      try {
        const res = await fetch('http://localhost:3001/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }

        const data: Usuario = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
      }
    };

    obtenerPerfil();
  }, []);

  if (!usuario) {
    return <p className="p-4">Cargando...</p>;
  }

  if (usuario.esAdmin) {
    const renderVista = () => {
      switch (vista) {
        case 'usuarios':
          return <VistaUsuarios />;
        case 'cursos':
          return <VistaCursos />;
        case 'agregarUsuario':
          return <AgregarUsuario onUsuarioCreado={() => setVista('usuarios')} />;
        default:
          return <p>Seleccioná una opción del menú</p>;
      }
    };

    return (
      <div className="flex h-screen">
        <MenuAdmin seleccionarVista={setVista} />
        <main className="flex-1 bg-white">{renderVista()}</main>
      </div>
    );
  }

  return (
    <main className="p-4">
      <PerfilUsuario usuario={usuario} />
    </main>
  );
}
