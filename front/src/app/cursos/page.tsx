import React from "react";
import Card from "@/components/tarjetas/page";

// Datos de ejemplo para los cursos adicionales (reemplaza con los cursos reales de Bara Creativa)
const additionalCourses = [
  {
    title: "Desarrollo Backend",
    image: "/courses/backend-development.jpg",
    description: "Aprende Node.js y Express para construir APIs robustas.",
  },
  {
    title: "Fotografía Digital",
    image: "/courses/digital-photography.jpg",
    description: "Domina técnicas de fotografía con cámaras digitales.",
  },
  {
    title: "Gestión de Proyectos",
    image: "/courses/project-management.jpg",
    description: "Herramientas y metodologías para liderar proyectos exitosos.",
  },
  {
    title: "Edición de Video",
    image: "/courses/video-editing.jpg",
    description:
      "Crea contenido profesional con Adobe Premiere y After Effects.",
  },
  {
    title: "Inteligencia Artificial",
    image: "/courses/artificial-intelligence.jpg",
    description: "Explora machine learning y sus aplicaciones prácticas.",
  },
  {
    title: "Diseño Gráfico",
    image: "/courses/graphic-design.jpg",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
];

const CoursesPage: React.FC = () => {
  return (
    <div className="bg-[var(--background)] font-sans min-h-screen">
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
          Todos Nuestros Cursos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
          {additionalCourses.map((course) => (
            <Card
              key={course.title}
              title={course.title}
              image={course.image}
              description={course.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
