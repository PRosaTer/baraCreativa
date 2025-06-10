"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const imagenes = [
  {
    src: "/Victor.JPG",
    alt: "Victor",
    rotate: "-rotate-6",
    classPosition: "top-[10%] left-[8%] md:top-[6%] md:left-[5%] sm:top-[8%] sm:left-[6%]",
    zIndex: 30,
  },
  {
    src: "/ZoomClase1.jpg",
    alt: "Zoom Clase",
    rotate: "rotate-3",
    classPosition: "top-[8%] right-[4%] md:top-[8%] md:right-[5%] sm:top-[7%] sm:right-[5%]",
    zIndex: 40,
  },
  {
    src: "/Pantalla1.jpg",
    alt: "Pantalla",
    rotate: "-rotate-12",
    classPosition: "bottom-[14%] left-[7%] md:bottom-[12%] md:left-[7%] sm:bottom-[13%] sm:left-[8%]",
    zIndex: 25,
  },
  {
    src: "/Victor2.jpg",
    alt: "Victor 2",
    rotate: "rotate-6",
    classPosition: "bottom-[12%] right-[7%] md:bottom-[10%] md:right-[7%] sm:bottom-[11%] sm:right-[8%]",
    zIndex: 35,
  },
  {
    src: "/Victor3.jpg",
    alt: "Victor 3",
    rotate: "-rotate-3",
    classPosition: "top-[28%] left-[26%] md:top-[30%] md:left-[30%] sm:top-[29%] sm:left-[28%]",
    zIndex: 50,
  },
  {
    src: "/Victor4.jpg",
    alt: "Victor 4",
    rotate: "rotate-12",
    classPosition: "bottom-[24%] right-[26%] md:bottom-[25%] md:right-[28%] sm:bottom-[23%] sm:right-[25%]",
    zIndex: 20,
  },
  {
    src: "/Victor5.jpg",
    alt: "Victor 5",
    rotate: "",
    classPosition: "top-[50%] left-[50%] md:top-[50%] md:left-[50%] sm:top-[50%] sm:left-[50%]",
    zIndex: 55,
    centerTransform: true,
  },
];

export default function Nosotros() {
  const [indiceVisible, setIndiceVisible] = useState(0);

  useEffect(() => {
    if (indiceVisible < imagenes.length - 1) {
      const timer = setTimeout(() => {
        setIndiceVisible((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [indiceVisible]);

  return (
    <div
      className="
        relative w-full min-h-screen bg-gray-100
      "
      style={{ overflow: "visible" }}
    >
      {imagenes.slice(0, indiceVisible + 1).map((img, i) => {
        const esUltima = i === imagenes.length - 1;

        const widthClamp = esUltima
          ? "clamp(250px, 45vw, 450px)"
          : "clamp(220px, 40vw, 400px)";

        return (
          <div
            key={i}
            className={`absolute ${img.classPosition} ${img.rotate} transition-all duration-700`}
            style={{
              width: widthClamp,
              aspectRatio: "1 / 1",
              maxWidth: "100%",
              zIndex: img.zIndex,
              transform: img.centerTransform ? "translate(-50%, -50%)" : undefined,
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover rounded-xl shadow-xl"
              priority={esUltima}
              sizes="(max-width: 480px) 70vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, (max-width: 1366px) 40vw, 400px"
              quality={80}
            />
          </div>
        );
      })}
    </div>
  );
}
