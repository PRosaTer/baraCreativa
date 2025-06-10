"use client";

import { useAlturaNavbar } from '../../app/hooks/useAlturaNavbar';
import { useAnimacionCompleta } from '../../app/hooks/useAnimacionCompleta';
import { ImagenFotos } from './ImagenFotos';
import { ListaImagenes } from '../../app/hooks/tipos';

const imagenes: ListaImagenes = [
  {
    src: "/Victor.JPG",
    alt: "Victor",
    rotate: "-rotate-6",
    classPosition: "top-[10%] left-[8%] lg:top-[4%] lg:left-[5%] md:top-[8%] md:left-[6%]",
    zIndex: 10,
  },
  {
    src: "/ZoomClase1.jpg",
    alt: "Zoom Clase",
    rotate: "rotate-3",
    classPosition: "top-[8%] right-[4%] lg:top-[4%] lg:right-[5%] md:top-[7%] md:right-[5%]",
    zIndex: 20,
  },
  {
    src: "/Pantalla1.jpg",
    alt: "Pantalla",
    rotate: "-rotate-12",
    classPosition: "bottom-[14%] left-[7%] lg:bottom-[14%] lg:left-[7%] md:bottom-[13%] md:left-[8%]",
    zIndex: 15,
  },
  {
    src: "/Victor2.jpg",
    alt: "Victor 2",
    rotate: "rotate-6",
    classPosition: "bottom-[12%] right-[7%] lg:bottom-[14%] lg:right-[7%] md:bottom-[11%] md:right-[8%]",
    zIndex: 25,
  },
  {
    src: "/Victor3.jpg",
    alt: "Victor 3",
    rotate: "-rotate-3",
    classPosition: "top-[28%] left-[26%] lg:top-[4%] lg:left-[30%] md:top-[29%] md:left-[28%]",
    zIndex: 30,
  },
  {
    src: "/Victor4.jpg",
    alt: "Victor 4",
    rotate: "rotate-12",
    classPosition: `
      bottom-[24%] right-[26%]
      sm:bottom-[25%]
      md:bottom-[30%]
      lg:bottom-[45%] lg:right-[25%]
      xl:bottom-[21%] xl:right-[26%]
      2xl:bottom-[51%] 2xl:right-[26%]
    `,
    zIndex: 35,
  },
  {
    src: "/Victor5.jpg",
    alt: "Victor 5",
    rotate: "",
    classPosition: "top-[50%] left-[50%]",
    zIndex: 50,
    centerTransform: true,
    isMain: true
  },
];

export const Nosotros = () => {
  const alturaNavbar = useAlturaNavbar();
  const cantidadVisible = useAnimacionCompleta(imagenes.length);

  return (
    <div 
      className="relative w-full bg-gray-100"
      style={{
        height: `calc(100vh - ${alturaNavbar})`,
        minHeight: `calc(100vh - ${alturaNavbar})`
      }}
    >
      <div className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_0)]">
        {imagenes.slice(0, cantidadVisible).map((imagen, i) => (
          <ImagenFotos key={i} imagen={imagen} />
        ))}
      </div>
    </div>
  );
};

export default Nosotros;