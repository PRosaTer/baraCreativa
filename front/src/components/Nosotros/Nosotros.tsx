"use client";

import { useAlturaNavbar } from "@/app/hooks/useAlturaNavbar";
import { useMostrarLienzo } from "@/app/hooks/useMostrarLienzo";
import { FondoFotosAnimadas } from "@/components/Nosotros/FondoFotosAnimadas";
import { imagenesNosotros } from "@/data/imagenesNosotros";
import { ContenedorNosotros } from "@/components/Nosotros/ContenedorNosotros";
import { LienzoCompleto } from "@/components/Nosotros/LienzoCompleto";

const Nosotros = () => {
  const alturaNavbar = useAlturaNavbar();
  const mostrarLienzo = useMostrarLienzo(12000);

  return (
    <ContenedorNosotros alturaNavbar={alturaNavbar}>
      <FondoFotosAnimadas imagenes={imagenesNosotros} />
      {mostrarLienzo && <LienzoCompleto />}
    </ContenedorNosotros>
  );
};

export default Nosotros;
