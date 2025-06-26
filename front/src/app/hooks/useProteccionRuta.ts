'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export function useProteccionRuta() {
  const { usuario, cargandoUsuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargandoUsuario && !usuario) {
      router.push('/login');
    }
  }, [usuario, cargandoUsuario, router]);
}
