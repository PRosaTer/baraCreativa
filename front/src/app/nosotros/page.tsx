"use client";

import SeccionEquipo from "@/components/acerca/seccionEquipo";
import AvataresFlotantes from "@/components/acerca/avataresFlotantes";
import Encabezado from "@/components/acerca/ecabezados";
import VisionMision from "@/components/acerca/VisionMision";
import Valores from "@/components/acerca/valores";
import Historia from "@/components/acerca/Historia";
import { equipo, vision, mision, valores, historia } from "@/data/acerca";

export default function Nosotros() {
  return (
    <div className="bg-gray-100 font-sans">
      <SeccionEquipo equipo={equipo} />
      <AvataresFlotantes equipo={equipo} />
      <Encabezado />
      <VisionMision vision={vision} mision={mision} />
      <Valores valores={valores} />
      <Historia historia={historia} />
    </div>
  );
}
