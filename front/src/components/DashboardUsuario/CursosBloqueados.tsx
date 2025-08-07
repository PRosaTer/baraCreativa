"use client";

import { Curso } from "@/app/types/curso";

interface CursosBloqueadosProps {
  cursos: Curso[];
}

export default function CursosBloqueados({ cursos }: CursosBloqueadosProps) {
  if (cursos.length === 0) {
    return null;
  }

  const titulo = "Estos cursos se van a ir desbloqueando en la fecha correspondiente";
  const palabras = titulo.split(" ");

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
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
        {palabras.map((palabra, index) => (
          <span
            key={index}
            className="animated-word"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {palabra}{" "}
          </span>
        ))}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cursos.map((curso) => {
          const fechaDeInicio = curso.fechaInicio ? new Date(curso.fechaInicio) : null;

          return (
            <div
              key={curso.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all transform hover:scale-105 opacity-50 cursor-not-allowed duration-300"

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
                <p className="inline-block mt-2 text-sm text-gray-400">
                  Se activa el: {fechaDeInicio?.toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
