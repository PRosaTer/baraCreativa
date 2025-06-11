"use client";

import { useAlturaNavbar } from "@/app/hooks/useAlturaNavbar";
import { useMostrarLienzo } from "@/app/hooks/useMostrarLienzo";
import { FondoFotosAnimadas } from "@/components/Comunidad/FondoFotosAnimadas";
import { imagenesComunidad } from "@/data/imagenesNosotros";
import { ContenedorNosotros } from "./ContenedorComunidad";
import { LienzoCompleto } from "@/components/Comunidad/LienzoCompleto";

const Nosotros = () => {
  const alturaNavbar = useAlturaNavbar();
  const mostrarLienzo = useMostrarLienzo(12000);

  return (
    <ContenedorNosotros alturaNavbar={alturaNavbar}>
      <FondoFotosAnimadas imagenes={imagenesComunidad} />
      {mostrarLienzo && <LienzoCompleto />}
    </ContenedorNosotros>
  );
};

export default Nosotros;
