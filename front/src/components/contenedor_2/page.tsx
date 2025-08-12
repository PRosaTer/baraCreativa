"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-[667px] h-auto lg:h-[592px] bg-gray-200 rounded-lg p-4 flex flex-col lg:flex-row gap-4 items-center justify-center">
      <div className="flex-1 w-full">
        <VideoSlider />
      </div>
      <div className="flex-1 w-full">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;
