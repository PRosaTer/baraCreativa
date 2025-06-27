"use client";

import { useEffect, useState } from 'react';
import { Curso } from '../../types/curso';

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      const res = await fetch('http://localhost:3001/cursos');
      const data = await res.json();
      setCursos(data);
      setCargando(false);
    };

    fetchCursos();
  }, []);

  return { cursos, cargando };
}