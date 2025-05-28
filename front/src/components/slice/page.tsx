"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PhotoCarousel = () => {
  // Array de imágenes locales en la carpeta public/images/
  const images = [
    "/Facebook-Logo-Transparent-PNG.png",
    "/Facebook-Logo-Transparent-PNG.png",
    "/Facebook-Logo-Transparent-PNG.png",
    "/Facebook-Logo-Transparent-PNG.png",
    "/Facebook-Logo-Transparent-PNG.png",
    "/Facebook-Logo-Transparent-PNG.png",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-96">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                priority={index === 0} // Carga prioritaria para la primera imagen
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoCarousel;
