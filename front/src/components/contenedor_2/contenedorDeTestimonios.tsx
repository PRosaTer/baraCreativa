"use client";

import { useEffect, useState } from "react";
import { testimoniosDeUsuarios } from "../../app/datos/testimoniosDeUsuarios";
import { motion, AnimatePresence } from "framer-motion";

const ContenedorDeTestimonios = () => {
  const [grupoActual, setGrupoActual] = useState(0);
  const [volteadas, setVolteadas] = useState<boolean[]>([false, false, false]);

  const grupos = [
    testimoniosDeUsuarios.slice(0, 3),
    testimoniosDeUsuarios.slice(3, 6),
  ];

  useEffect(() => {
    setVolteadas([false, false, false]);

    const flipTimers = grupos[grupoActual].map((_, i) =>
      setTimeout(() => {
        setVolteadas((prev) => {
          const copia = [...prev];
          copia[i] = true;
          return copia;
        });
      }, 3000)
    );

    const cambioDeGrupo = setTimeout(() => {
      setGrupoActual((prev) => (prev + 1) % grupos.length);
    }, 10000);

    return () => {
      flipTimers.forEach(clearTimeout);
      clearTimeout(cambioDeGrupo);
    };
  }, [grupoActual]);

  return (
    <div className="relative w-full h-[380px] mt-64 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={grupoActual}
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -200 }}
          transition={{ duration: 0.8 }}
          className="flex gap-4"
        >
          {grupos[grupoActual].map((testimonio, i) => (
            <motion.div
              key={testimonio.nombre}
              className="w-[180px] h-[240px] relative rounded-lg shadow-lg cursor-pointer"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{ rotateY: volteadas[i] ? 180 : 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >

                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={testimonio.imagen}
                    alt={testimonio.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    backgroundColor: "#fed7aa",
                    color: "#78350f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    transform: "rotateY(180deg)",
                    textAlign: "center",
                  }}
                >
                  {testimonio.mensaje}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContenedorDeTestimonios;
