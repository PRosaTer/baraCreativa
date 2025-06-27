// import Link from "next/link";
// import Card from "@/components/tarjetas/page";

// // Importar solo los datos necesarios
// import { additionalCourses, additionalServices } from "@/app/data/data-cursos";

// export default function CoursesPage() {
//   return (
//     <div className="bg-[var(--background)] font-sans min-h-screen">
//       {/* Sección de Cursos */}
//       <section className="container mx-auto py-12">
//         <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
//           Todos Nuestros Cursos
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
//           {additionalCourses.map((course) => (
//             <Link href={`/cursos/${course.id}`} key={course.id}>
//               <Card
//                 title={course.title}
//                 image={course.image}
//                 description={course.description}
//               />
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* Sección de Servicios */}
//       <section className="container mx-auto py-12">
//         <h1 className="text-3xl font-bold text-center text-[var(--foreground)] mb-8">
//           Nuestros Servicios
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8">
//           {additionalServices.map((service) => (
//             <Card
//               key={service.title}
//               title={service.title}
//               image={service.image}
//               description={service.description}
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


import CardsList from '@/components/tarjetas/cursos/page';
import { Curso } from '@/app/types/curso';


async function fetchCursos(): Promise<Curso[]> {
  try {
    const res = await fetch('http://localhost:3001/api/cursos', { cache: 'no-store' });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error al obtener cursos (fetchCursos):', res.status, res.statusText, errorData);
      return [];
    }
    const data: Curso[] = await res.json();
    console.log('Cursos obtenidos del backend:', data);
    return data;
  } catch (error) {
    console.error('Error fetching courses (fetchCursos):', error);
    return [];
  }
}

export default async function CursosPage() {
  const cursos = await fetchCursos();

  return (
    <main className="bg-[var(--background)] font-sans min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-[var(--foreground)] mb-12">
        Todos Nuestros Cursos y Servicios
      </h1>
      {cursos.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No hay cursos disponibles en este momento.</p>
      ) : (
        <CardsList cursos={cursos} />
      )}
    </main>
  );
}