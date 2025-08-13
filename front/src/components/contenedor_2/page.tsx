"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full bg-gray-200 rounded-lg p-4 flex flex-col items-center gap-6">
      
      <div className="w-full">
        <VideoSlider />
      </div>

      <div className="w-full">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;