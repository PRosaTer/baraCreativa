import { useEffect, useRef } from "react";
import type { ElementoHistoria } from "@/data/acerca";

interface HistoriaProps {
  historia: ElementoHistoria[];
}

export default function Historia({ historia }: HistoriaProps) {
  const elementosLineaTiempoRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    elementosLineaTiempoRef.current.forEach(
      (elemento) => elemento && observador.observe(elemento)
    );

    return () => observador.disconnect();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Nuestra Historia
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-600"></div>
          <div className="space-y-8">
            {historia.map((elemento, indice) => (
              <div
                key={indice}
                ref={(el) => {
                  elementosLineaTiempoRef.current[indice] = el;
                }}
                className={`elemento-linea-tiempo bg-white p-6 rounded-lg shadow-lg ${
                  indice % 2 === 0 ? "ml-8" : "mr-8 text-right"
                } relative opacity-0 translate-y-12 transition-all duration-500 ease-in-out`}
              >
                <div
                  className={`absolute w-4 h-4 bg-blue-600 rounded-full ${
                    indice % 2 === 0 ? "-left-8" : "-right-8"
                  } top-1/2 -translate-y-1/2`}
                ></div>
                <h3 className="text-lg font-semibold">{`${elemento.año} - ${elemento.titulo}`}</h3>
                <p
                  className="mt-2 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: elemento.descripcion }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .elemento-linea-tiempo.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
