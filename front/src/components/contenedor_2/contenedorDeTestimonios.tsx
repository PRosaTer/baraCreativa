"use client";

import { useEffect, useState } from "react";
import { testimoniosDeUsuarios } from "../../app/testimonios/testimoniosDeUsuarios";
import { motion, AnimatePresence } from "framer-motion";

const ContenedorDeTestimonios = () => {
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % testimoniosDeUsuarios.length);
    }, 8000);

    return () => clearInterval(intervalo);
  }, []);

  const testimonio = testimoniosDeUsuarios[indiceActual];

  return (
    <div className="relative w-[580px] h-[250px] mt-72 overflow-hidden mx-auto flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={indiceActual}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="flex bg-orange-100 text-orange-900 rounded-lg shadow-lg p-6 gap-4 w-full h-full"
        >
          <img
            src={testimonio.imagen}
            alt={testimonio.nombre}
            className="w-[120px] h-[120px] object-cover rounded-full self-center border-2 border-orange-300"
          />

          <div className="flex flex-col justify-center h-full">
            <h3 className="text-lg font-bold mb-2">{testimonio.nombre}</h3>
            <p className="text-sm whitespace-pre-line">{testimonio.mensaje}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContenedorDeTestimonios;
