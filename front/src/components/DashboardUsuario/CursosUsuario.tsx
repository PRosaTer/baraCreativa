"use client";

import { useEffect, useState } from "react";

interface Curso {
  id: number;
  titulo: string;
  imagenCurso?: string;
}

export default function CursosUsuario() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch("http://localhost:3001/inscripciones/mis-cursos", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("No se pudieron obtener tus cursos");
        }

        const data: Curso[] = await res.json();
        setCursos(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Error inesperado");
      }
    };

    fetchCursos();
  }, []);

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  if (cursos.length === 0) {
    return <p style={{ textAlign: "center" }}>No tienes cursos aún 😢</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {cursos.map((curso) => (
        <div
          key={curso.id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-yellow-500/30 transition-shadow"
        >
          {curso.imagenCurso && (
            <img
              src={`http://localhost:3001${curso.imagenCurso}`}
              alt={curso.titulo}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">{curso.titulo}</h3>
            <a
              href={`/cursos/${curso.id}/scorm`}
              className="inline-block mt-2 text-sm text-yellow-300 hover:underline"
            >
              Entrar al curso
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
