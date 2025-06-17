import React from "react";
import Card from "@/components/tarjetas/page";

// Datos de ejemplo para los cursos adicionales (reemplaza con los cursos reales de Bara Creativa)
const additionalCourses = [
  {
    title: "FORMACION  CAT",
    image: "/formacion-cat.png",
    description: "Aprende Node.js y Express para construir APIs robustas.",
  },
  {
    title: "DEMENTES VERDES",
    image: "/dementes-verdas.png",
    description: "Domina técnicas de fotografía con cámaras digitales.",
  },
  {
    title: "GOOGLE DOCS",
    image: "/google-docs.png",
    description: "Herramientas y metodologías para liderar proyectos exitosos.",
  },
  {
    title: "BARA GAMES",
    image: "/BARA-GAMES.png",
    description:
      "Crea contenido profesional con Adobe Premiere y After Effects.",
  },
  {
    title: "VIRTUAL T",
    image: "/virtual-t.png",
    description: "Explora machine learning y sus aplicaciones prácticas.",
  },
  {
    title: "ALGOLider",
    image: "/algo-lider.png",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
  {
    title: "GOOGLEANDO",
    image: "/googleando.png",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
  {
    title: "SUMA +1 UTILZANDO LINKEDIN",
    image: "/suma+1-utilizando-linkedin.png",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
  {
    title: "FABRICA DE CREATIVOS",
    image: "/fabrica-de-creativos.png",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
  {
    title: "DISRUPTED",
    image: "/disrupted.png",
    description: "Crea diseños impactantes con Adobe Photoshop e Illustrator.",
  },
];

// Datos de ejemplo para los servicios adicionales (reemplaza con los servicios reales de Bara Creativa)
const additionalServices = [
  {
    title: "PROYECTOS DE CAPACITACION EMPRESARIAL",
    image: "/foto-servicio.png",
    description:
      "Programas de formación adaptados a las necesidades de tu empresa.",
  },
  {
    title: "DESARROLLO DE PROYECTOS E LEARNING",
    image: "/desarrollo-de-proyectos-e-learning.png",
    description: "Creación de plataformas y cursos online interactivos.",
  },
  {
    title: "COACHING EDUCATIVO BC",
    image: "/coaching-educativo-bc.png",
    description:
      "Soluciones para optimizar procesos educativos y de capacitación.",
  },
  {
    title: "DESSARROLLO DE PROYECTOS E LAEARNING BC",
    image: "/desarrollo-de-proyectos-e-learning-bc.png",
    description: "Videos educativos y promocionales de alta calidad.",
  },
  {
    title: "PROYECTO DE CAPACITACION EMPRESARIAL",
    image: "/desarrollo-de-proyectos-e-learning-bc.png",
    description: "Videos educativos y promocionales de alta calidad.",
  },
];

const CoursesPage: React.FC = () => {
  return (
    <div className="bg-[var(--background)] font-sans min-h-screen">
      {/* Sección de Cursos */}
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

      {/* Sección de Servicios */}
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
          Nuestros Servicios
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
          {additionalServices.map((service) => (
            <Card
              key={service.title}
              title={service.title}
              image={service.image}
              description={service.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
