"use client";

import { useAnimacionCompleta } from "../../app/hooks/useAnimacionCompleta";
import { ImagenFotos } from "./ImagenFotos";
import { ListaImagenes } from "../../app/types/tipos";

interface Props {
  imagenes: ListaImagenes;
}

export const FondoFotosAnimadas = ({ imagenes }: Props) => {
  const cantidadVisible = useAnimacionCompleta(imagenes.length);

  return (
    <div className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_0)]">
      {imagenes.slice(0, cantidadVisible).map((imagen, i) => (
        <ImagenFotos key={i} imagen={imagen} />
      ))}
    </div>
  );
};
