import Link from "next/link";
import Card from "@/components/tarjetas/page";

// Importar solo los datos necesarios
import { additionalCourses, additionalServices } from "@/app/data/data-cursos";

export default function CoursesPage() {
  return (
    <div className="bg-[var(--background)] font-sans min-h-screen">
      {/* Sección de Cursos */}
      <section className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
          Todos Nuestros Cursos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
          {additionalCourses.map((course) => (
            <Link href={`/cursos/${course.id}`} key={course.id}>
              <Card
                title={course.title}
                image={course.image}
                description={course.description}
              />
            </Link>
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
}
