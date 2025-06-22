import Image from "next/image";
import { useEffect, useRef } from "react";
import type { MiembroEquipo } from "@/data/acerca";

interface AvataresFlotantesProps {
  equipo: MiembroEquipo[];
}

export default function AvataresFlotantes({ equipo }: AvataresFlotantesProps) {
  const avataresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const manejarScroll = () => {
      const seccionEquipo = document.getElementById("seccion-equipo");
      if (seccionEquipo && avataresRef.current) {
        const seccionEquipoBottom =
          seccionEquipo.getBoundingClientRect().bottom;
        const avatares =
          avataresRef.current.querySelectorAll(".avatar-flotante");
        if (seccionEquipoBottom < 0) {
          avatares.forEach((avatar) => avatar.classList.add("visible"));
        } else {
          avatares.forEach((avatar) => avatar.classList.remove("visible"));
        }
      }
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  return (
    <div
      ref={avataresRef}
      className="fixed top-5 right-5 flex flex-col gap-2.5 z-[1000] sm:block hidden"
    >
      {equipo.map((miembro, indice) => (
        <Image
          key={indice}
          src={miembro.imagen}
          alt={miembro.nombre}
          width={50}
          height={50}
          className="avatar-flotante w-[50px] h-[50px] rounded-full object-cover border-2 border-white shadow-lg opacity-0 transition-opacity duration-300"
        />
      ))}
      <style jsx>{`
        .avatar-flotante.visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
