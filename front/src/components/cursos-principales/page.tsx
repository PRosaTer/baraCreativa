import React from "react";
import Card from "@/components/tarjetas/page";

// Datos de ejemplo para los tres cursos (reemplaza con los cursos reales de Bara Creativa)
const courses = [
  {
    title: "FORMACION CAT",
    image: "/formacion-cat.png",
    description:
      "Aprende HTML, CSS y JavaScript para crear sitios web dinámicos.",
  },
  {
    title: "BARA GAMES",
    image: "/BARA-GAMES.png",
    description:
      "Crea interfaces intuitivas y atractivas con las mejores prácticas.",
  },
  {
    title: "VIRTUAL T",
    image: "/virtual-t.png",
    description:
      "Domina estrategias para promocionar tu marca en redes sociales.",
  },
];

const ThreeCoursesSection: React.FC = () => {
  return (
    <section className="container mx-auto py-12 bg-[var(--background)]">
      <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
        Nuestros Cursos Destacados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {courses.slice(0, 3).map((course) => (
          <Card
            key={course.title}
            title={course.title}
            image={course.image}
            description={course.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreeCoursesSection;
