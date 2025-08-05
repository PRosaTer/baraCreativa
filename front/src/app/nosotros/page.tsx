"use client";

import AvataresFlotantes from "@/components/acerca/avataresFlotantes";
import Encabezado from "@/components/acerca/ecabezados";
import VisionMision from "@/components/acerca/VisionMision";
import Valores from "@/components/acerca/valores";
import Reconocimientos from "@/components/acerca/reconocimientos";
import Historia from "@/components/acerca/Historia";
import { equipo, vision, mision, valores, historia } from "@/data/acerca";

export default function Nosotros() {
  return (
    <div className="bg-gray-100 font-sans">
      <AvataresFlotantes equipo={equipo} />
      <Encabezado />
      <VisionMision vision={vision} mision={mision} />
      <Valores valores={valores} />
      <Historia historia={historia} />
      <Reconocimientos />
    </div>
  );
}
