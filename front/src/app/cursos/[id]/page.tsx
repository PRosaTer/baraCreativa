// import Link from "next/link";
// import { notFound } from "next/navigation";
// import Image from "next/image";

// // Importar los datos desde lib/data
// import { additionalCourses } from "@/app/data/data-cursos";

// // Definir la interfaz Course
// interface Course {
//   id: number;
//   title: string;
//   image: string;
//   description: string;
//   details: {
//     duration: string;
//     content: string;
//     instructor: string;
//     price: string;
//     modules: string[];
//   };
// }

// // Generar los paths para los cursos válidos
// export async function generateStaticParams() {
//   return additionalCourses.map((course) => ({
//     id: course.id.toString(), // Asegurar que el id sea string
//   }));
// }

// export default function CourseDetail({ params }: { params: { id: string } }) {
//   const courseId = parseInt(params.id, 10);
//   const course = additionalCourses.find((c) => c.id === courseId);

//   if (!course) {
//     notFound();
//   }

//   return (
//     <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <Link
//         href="/cursos"
//         className="inline-block mb-6 text-blue-600 hover:underline text-lg"
//       >
//         ← Volver a la lista de cursos
//       </Link>
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <Image
//           src={course.image}
//           alt={course.title}
//           width={1200}
//           height={400}
//           className="w-full h-64 object-cover"
//         />
//         <div className="p-6">
//           <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
//             {course.title}
//           </h1>
//           <p className="text-gray-600 mb-4">{course.description}</p>
//           {course.title === "FORMACION CAT" && (
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold">Video Introductorio</h2>
//               <video
//                 src="/videos/formacion-cat-intro.mp4"
//                 controls
//                 className="w-full"
//               />
//             </div>
//           )}
//           {course.title === "DEMENTES VERDES" && (
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold">Galería de Fotos</h2>
//               <div className="grid grid-cols-3 gap-2">
//                 <Image
//                   src="/photos/photo1.jpg"
//                   alt="Foto 1"
//                   width={200}
//                   height={200}
//                 />
//                 <Image
//                   src="/photos/photo2.jpg"
//                   alt="Foto 2"
//                   width={200}
//                   height={200}
//                 />
//               </div>
//             </div>
//           )}
//           {course.title === "GOOGLE DOCS" && (
//             <div className="mb-4">
//               <h2 className="text-xl font-semibold">Plantillas Descargables</h2>
//               <a
//                 href="/downloads/google-docs-template.pdf"
//                 className="text-blue-600 hover:underline"
//               >
//                 Descargar plantilla
//               </a>
//             </div>
//           )}
//           <div className="space-y-4">
//             <p>
//               <strong>Duración:</strong> {course.details.duration}
//             </p>
//             <p>
//               <strong>Contenido:</strong> {course.details.content}
//             </p>
//             <p>
//               <strong>Instructor:</strong> {course.details.instructor}
//             </p>
//             <p>
//               <strong>Precio:</strong> {course.details.price}
//             </p>
//             <h2 className="text-xl font-semibold">Módulos del curso</h2>
//             <ul className="list-disc pl-5 space-y-2">
//               {course.details.modules.map((module, index) => (
//                 <li key={index} className="text-gray-600">
//                   {module}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//             Inscribirme ahora
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const courseId = parseInt(params.id, 10);
//   const course = additionalCourses.find((c) => c.id === courseId);

//   if (!course) {
//     return { title: "Curso no encontrado" };
//   }

//   return {
//     title: course.title,
//     description: course.description,
//   };
// }

// import { notFound } from 'next/navigation';
// import Image from 'next/image';

// interface Curso {
//   id: number;
//   titulo: string;
//   descripcion: string;
//   imagenCurso: string | null;
//   tipo: string;
//   categoria: string;
//   duracionHoras: number;
//   precio: number;
//   modalidad: string;
//   certificadoDisponible: boolean;
//   badgeDisponible: boolean;
// }

// async function fetchCurso(id: number): Promise<Curso | null> {
//   try {
//     const res = await fetch(`http://localhost:3001/api/cursos/${id}`);
//     if (!res.ok) return null;
//     return await res.json();
//   } catch {
//     return null;
//   }
// }

// export default async function CursoPage({ params }: { params: { id: string } }) {
//   const curso = await fetchCurso(parseInt(params.id));

//   if (!curso) notFound();

//   const urlImagen = curso.imagenCurso
//     ? `http://localhost:3001/uploads/${curso.imagenCurso}`
//     : '/placeholder.png';

//   return (
//     <div className="container mx-auto py-12 px-4">
//       <Image
//         src={urlImagen}
//         alt={curso.titulo}
//         width={1200}
//         height={400}
//         className="w-full h-64 object-cover"
//       />
//       <h1 className="text-3xl font-bold my-4">{curso.titulo}</h1>
//       <p>{curso.descripcion}</p>
//       {/* Más detalles del curso aquí */}
//     </div>
//   );
// }


import { notFound } from 'next/navigation';
import CursoDetail from './curso-detail';
import { getCursoById } from '@/app/lib/data/cursos';

interface CursoDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CursoPage({ params }: CursoDetailPageProps) {
  const curso = await getCursoById(params.id);

  if (!curso) {
    notFound();
  }

  return <CursoDetail curso={curso} />;
}