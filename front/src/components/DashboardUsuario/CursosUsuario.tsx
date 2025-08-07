"use client";

import { useEffect, useState } from "react";
import { Curso } from "@/app/types/curso";

export default function CursosUsuario() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/cursos", {
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
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (cursos.length === 0) {
    return <p className="text-center">No tienes cursos aún 😢</p>;
  }

  const cursosOrdenados = [...cursos].sort((a, b) => {
    const fechaA = a.fechaInicio ? new Date(a.fechaInicio).getTime() : Infinity;
    const fechaB = b.fechaInicio ? new Date(b.fechaInicio).getTime() : Infinity;
    return fechaA - fechaB;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {cursosOrdenados.map((curso) => {
        const fechaDeInicio = curso.fechaInicio ? new Date(curso.fechaInicio) : null;
        const ahora = new Date();
        const estaBloqueado = fechaDeInicio && fechaDeInicio > ahora;

        const CourseCard = estaBloqueado ? "div" : "a";

        return (
          <CourseCard
            key={curso.id}
            href={!estaBloqueado ? `/cursos/${curso.id}/scorm` : undefined}
            className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-shadow ${
              estaBloqueado
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-yellow-500/30 cursor-pointer"
            }`}
          >
            {curso.imagenCurso && (
              <img
                src={`http://localhost:3001${curso.imagenCurso}`}
                alt={curso.titulo}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                {curso.titulo}
              </h3>
              {estaBloqueado ? (
                <p className="inline-block mt-2 text-sm text-gray-400">
                  Se activa el: {fechaDeInicio?.toLocaleDateString()}
                </p>
              ) : null}
            </div>
          </CourseCard>
        );
      })}
    </div>
  );
}
