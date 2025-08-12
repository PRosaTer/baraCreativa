"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-[667px] h-[750px] lg:h-[592px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-start gap-4">
      <VideoSlider />
     <div className="
  mt-auto 
  h-[200px]          /* altura base */
  md:h-[300px]       /* altura +100px en pantallas md (768px+) */
  lg:h-[250px]       /* altura intermedia en pantallas grandes */
">
  <ContenedorDeTestimonios />
</div>
    </div>
  );
};

export default HeavyComponent;
