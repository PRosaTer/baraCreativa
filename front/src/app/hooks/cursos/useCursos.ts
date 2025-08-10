"use client";

import { useEffect, useState } from 'react';
import { Curso } from '../../types/curso';

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`);
      const data = await res.json();
      setCursos(data);
      setCargando(false);
    };

    fetchCursos();
  }, []);

  return { cursos, cargando };
}