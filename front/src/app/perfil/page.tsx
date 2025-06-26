'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuAdmin from '@/components/DashboardAdmin/MenuAdmin';
import VistaUsuarios from '@/components/DashboardAdmin/VistaUsuarios';
import VistaCursos from '@/components/DashboardAdmin/VistaCursos';
import AgregarUsuario from '@/components/DashboardAdmin/AgregarUsuario';
import PerfilUsuarioEditable from '@/components/DashboardUsuario/PerfilUsuario';
import { Usuario } from '@/app/types/auth';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [vista, setVista] = useState<'usuarios' | 'cursos' | 'agregarUsuario'>('usuarios');
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch('http://localhost:3001/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          setMensajeError('No autorizado. Debes iniciar sesión para acceder.');
          setTimeout(() => {
            router.push('/login');
          }, 4000);
          return;
        }

        const data: Usuario = await res.json();
        setUsuario(data);
        setMensajeError(null);
      } catch (error) {
        setMensajeError('Error desconocido al obtener perfil.');
        setTimeout(() => {
          router.push('/login');
        }, 4000);
      }
    };

    obtenerPerfil();
  }, [router]);

  if (mensajeError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
        <div className="max-w-md w-full bg-white border border-yellow-400 text-yellow-800 rounded-lg shadow-md p-6 text-center font-semibold select-none">
          {mensajeError}
          <p className="mt-2 text-sm text-yellow-700">
            Serás redirigido a la página de inicio de sesión en breve...
          </p>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-row min-h-screen">
        <MenuAdmin seleccionarVista={setVista} />
        <main className="flex-1 bg-white p-4">{renderVista()}</main>
      </div>
    );
  }

  return (
    <main className="p-4 bg-white">
      <PerfilUsuarioEditable usuario={usuario} onActualizar={setUsuario} />
    </main>
  );
}
