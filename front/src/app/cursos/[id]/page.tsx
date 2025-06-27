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
import Image from 'next/image';


interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
}

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number | string;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: string | null;
  modulos?: Modulo[]; 
}

interface CursoDetailPageProps {
  params: {
    id: string;
  };
}


async function getCursoById(id: string): Promise<Curso | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener el curso ${id}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener el curso con ID ${id}:`, error);
    return null;
  }
}


export default async function CursoDetailPage({ params }: CursoDetailPageProps) {
  const curso = await getCursoById(params.id);
  if (!curso) {
    notFound();
  }


  let precioNumerico: number;
  if (typeof curso.precio === 'string') {
    precioNumerico = parseFloat(curso.precio);
  } else if (typeof curso.precio === 'number') {
    precioNumerico = curso.precio;
  } else {
    console.warn(`Tipo inesperado para curso.precio: ${typeof curso.precio}, valor: ${curso.precio}`);
    precioNumerico = 0;
  }


  const precioFormateado = !isNaN(precioNumerico) ? precioNumerico.toFixed(2) : 'N/A';
 

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white shadow-lg rounded-lg my-8">
   
      {curso.imagenCurso && (
        <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
          <Image
            src={`http://localhost:3001/uploads/imagenes-cursos/${curso.imagenCurso}`}
            alt={curso.titulo}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-4">
        {curso.titulo}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detalles Generales</h2>
          <p className="text-gray-700 mb-2"><strong>Descripción:</strong> {curso.descripcion}</p>
          <p className="text-gray-700 mb-2"><strong>Tipo:</strong> {curso.tipo}</p>
          <p className="text-gray-700 mb-2"><strong>Categoría:</strong> {curso.categoria}</p>
          <p className="text-gray-700 mb-2"><strong>Duración:</strong> {curso.duracionHoras} horas</p>
          <p className="text-gray-700 mb-2"><strong>Precio:</strong> ${precioFormateado}</p>
          <p className="text-gray-700 mb-2"><strong>Modalidad:</strong> {curso.modalidad}</p>
          <p className="text-gray-700 mb-2"><strong>Certificado Disponible:</strong> {curso.certificadoDisponible ? 'Sí' : 'No'}</p>
          <p className="text-gray-700 mb-2"><strong>Badge Disponible:</strong> {curso.badgeDisponible ? 'Sí' : 'No'}</p>
        </div>

        {curso.modulos && curso.modulos.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Módulos del Curso</h2>
            <ul className="list-disc list-inside space-y-2">
              {curso.modulos.map((modulo) => (
                <li key={modulo.id} className="text-gray-700">
                  <strong className="text-indigo-600">{modulo.titulo}:</strong> {modulo.descripcion}
                  {modulo.videoUrl && <span className="ml-2 text-sm text-blue-500">(Video)</span>}
                  {modulo.pdfUrl && <span className="ml-2 text-sm text-purple-500">(PDF)</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <a href="/cursos" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Volver a Cursos
        </a>
      </div>
    </div>
  );
}