"use client";

import { useEffect, useState } from "react";
import { Curso } from "@/app/types/curso";
import CursosBloqueados from "./CursosBloqueados";

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

  const ahora = new Date();

  const cursosDesbloqueados = cursosOrdenados.filter((curso) => {
    const fechaDeInicio = curso.fechaInicio ? new Date(curso.fechaInicio) : null;
    return !fechaDeInicio || fechaDeInicio <= ahora;
  });

  const cursosBloqueados = cursosOrdenados.filter((curso) => {
    const fechaDeInicio = curso.fechaInicio ? new Date(curso.fechaInicio) : null;
    return fechaDeInicio && fechaDeInicio > ahora;
  });


  const cursosDisponibles = cursosDesbloqueados.filter(
    (curso) => curso.claseItem === "curso"
  );
  const serviciosDisponibles = cursosDesbloqueados.filter(
    (curso) => curso.claseItem === "servicio"
  );

  const tituloCursos = "Cursos disponibles";
  const palabrasCursos = tituloCursos.split(" ");
  const tituloServicios = "Servicios disponibles";
  const palabrasServicios = tituloServicios.split(" ");

  return (
    <>
      <style>{`
        @keyframes color-fade {
          0%, 100% { color: #ef4444; } /* Rojo */
          50% { color: #eab308; } /* Amarillo */
        }
        .animated-word {
          animation: color-fade 5s ease-in-out infinite;
        }
      `}</style>


      {cursosDisponibles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
            {palabrasCursos.map((palabra, index) => (
              <span
                key={index}
                className="animated-word"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {palabra}{" "}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {cursosDisponibles.map((curso) => (
              <a
                key={curso.id}
                href={`/cursos/${curso.id}/scorm`}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-yellow-500/30 transform hover:scale-105 duration-300 cursor-pointer"
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
                </div>
              </a>
            ))}
          </div>
        </>
      )}


      {serviciosDisponibles.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
            {palabrasServicios.map((palabra, index) => (
              <span
                key={index}
                className="animated-word"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {palabra}{" "}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {serviciosDisponibles.map((curso) => (
              <a
                key={curso.id}
                href={`/cursos/${curso.id}/scorm`}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-yellow-500/30 transform hover:scale-105 duration-300 cursor-pointer"
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
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      <CursosBloqueados cursos={cursosBloqueados} />
    </>
  );
}
