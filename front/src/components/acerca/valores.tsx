import type { Valor } from "@/data/acerca";

interface ValoresProps {
  valores: Valor[];
}

export default function Valores({ valores }: ValoresProps) {
  return (
    <section className="py-12 bg-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {valores.map((valor, indice) => (
            <div
              key={indice}
              className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              <h3 className={`text-xl font-semibold text-${valor.color}`}>
                {valor.nombre}
              </h3>
              <p className="mt-2 text-gray-600">{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
