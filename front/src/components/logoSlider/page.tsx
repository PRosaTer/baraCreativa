"use client";
// components/LogoSlider/page.tsx
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const brands = [
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },
  { src: "/Facebook-Logo-Transparent-PNG.png", alt: "Facebook" },

  // Agrega más imágenes para un mejor efecto
];

const LogoSlider = () => {
  return (
    <section className="container mx-auto py-8 bg-[var(--background)]">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-6">
        Marcas con las que hemos trabajado
      </h2>
      <Swiper
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 }, // sm
          768: { slidesPerView: 4 }, // md
          1024: { slidesPerView: 5 }, // lg
        }}
        spaceBetween={16}
        loop={brands.length > 1} // Solo activa el loop si hay más de una imagen
        autoplay={{
          delay: 0, // Desplazamiento continuo
          disableOnInteraction: false, // No se detiene al interactuar
          pauseOnMouseEnter: false, // No pausa al pasar el mouse
        }}
        speed={5000} // Ajusta la velocidad (menor = más rápido)
        modules={[Autoplay]}
        className="w-full"
      >
        {brands.map((brand, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="min-w-[150px] mx-4">
              <Image
                src={brand.src}
                alt={brand.alt}
                width={150}
                height={80}
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LogoSlider;
