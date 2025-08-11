"use client";

import { useEffect, useState } from "react";
import { Curso } from "../../types/curso";

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`);
        if (!res.ok) {
          throw new Error(`Error al cargar cursos: ${res.statusText}`);
        }
        const data = await res.json();
        setCursos(data);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError("Error desconocido al cargar cursos");
      } finally {
        setCargando(false);
      }
    };

    fetchCursos();
  }, []);

  return { cursos, cargando, error };
}
