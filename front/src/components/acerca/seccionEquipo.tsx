// import Image from "next/image";
// import type { MiembroEquipo } from "@/data/acerca";

// interface SeccionEquipoProps {
//   equipo: MiembroEquipo[];
// }

// export default function SeccionEquipo({ equipo }: SeccionEquipoProps) {
//   return (
//     <section id="seccion-equipo" className="py-12 bg-orange-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
//           Nuestro Equipo
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {equipo.map((miembro, indice) => (
//             <div
//               key={indice}
//               className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
//             >
//               <Image
//                 src={miembro.imagen}
//                 alt={miembro.nombre}
//                 width={128}
//                 height={128}
//                 className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
//               />
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {miembro.nombre}
//               </h3>
//               <p className="text-gray-600">{miembro.rol}</p>
//               <p className="mt-2 text-gray-500">{miembro.descripcion}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
