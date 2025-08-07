"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const reconocimientos = [
  {
    titulo: "Premio Terra te Impulsa | Ruta de la Dinamización",
    fecha: "Julio 2022",
    descripcion:
      "Galardonados por nuestra participación en la Ruta de Dinamización, con el respaldo de Impact Hub, USAID y Fundación Terra.",
    imagenes: ["/terra1.jpg", "/terra2.jpg"],
  },
  {
    titulo: "Premio Tech4DEVHN",
    fecha: "Febrero 2023",
    descripcion:
      "Ganadores del primer lugar en el programa de aceleración Tech4DEVHN como la startup con mayor avance.",
    imagenes: ["/tech4dev.jpg", "/tech4dev2.jpg"],
  },
  {
    titulo: "Premio Innovate | Categoría Smart Cities",
    fecha: "Noviembre 2023",
    descripcion:
      "Ganadores del primer lugar en Smart Cities a nivel de Centroamérica y México en el Innovate Entrepreneurship Summit.",
    imagenes: ["/innovate1.jpg", "/innovate2.jpg"],
  },
  {
    titulo:
      "Premio a mentor destacado programa Incubacion 504 Camara de Comercio e industrias de Comayagua",
    fecha: "diciembre 2024",
    descripcion:
      "Se otorgo a Victor Padilla, un reconocimiento como mentor del proyecto ganador a nivel nacional del programa Conecta de Bridge for Billions",
    imagenes: ["/comayagua1.jpg", "/comayagua2.jpg"],
  },
];

export default function Reconocimientos() {
  return (
    <section className="px-6 py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-10">
        Reconocimientos y Premios
      </h2>
      <div className="space-y-12 max-w-5xl mx-auto">
        {reconocimientos.map((premio, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-1 flex">
                <div className="grid grid-cols-2 w-full">
                  {premio.imagenes.map((src, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`Imagen ${idx + 1} de ${premio.titulo}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-semibold">{premio.titulo}</h3>
                <span className="text-sm text-gray-500 mb-2">
                  {premio.fecha}
                </span>
                <p className="text-gray-700">{premio.descripcion}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
