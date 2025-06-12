import React from "react";
import Image from "next/image";

// Datos de ejemplo para los tres cursos (puedes reemplazarlos con datos reales)
const courses = [
  {
    title: "Programación Web",
    image: "/BARA-GAMES.png",
    description:
      "Aprende HTML, CSS y JavaScript para crear sitios web dinámicos.",
  },
  {
    title: "Diseño UX/UI",
    image: "/BARA-GAMES.png",
    description:
      "Crea interfaces intuitivas y atractivas con las mejores prácticas.",
  },
  {
    title: "Marketing Digital",
    image: "/BARA-GAMES.png",
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
          <div
            key={course.title}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={course.image}
              alt={course.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeCoursesSection;
