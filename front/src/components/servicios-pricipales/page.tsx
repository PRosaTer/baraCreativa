import React from "react";
import Image from "next/image";

// Datos de ejemplo para los tres servicios (reemplaza con los servicios reales de Bara Creativa)
const services = [
  {
    title: "Capacitaciones Empresariales",
    image: "/foto-servicio.png",
    description:
      "Soluciones personalizadas para mejorar las habilidades de tu equipo.",
  },
  {
    title: "Consultoría Educativa",
    image: "/foto-servicio.png",
    description:
      "Asesoría para optimizar programas de aprendizaje y e-learning.",
  },
  {
    title: "Desarrollo de Contenidos",
    image: "/foto-servicio.png",
    description:
      "Creación de materiales educativos interactivos y de alto impacto.",
  },
];

const ThreeServicesSection: React.FC = () => {
  return (
    <section className="container mx-auto py-12 bg-[var(--background)]">
      <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
        Servicios que Brindamos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {services.slice(0, 3).map((service) => (
          <div
            key={service.title}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={service.image}
              alt={service.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeServicesSection;
