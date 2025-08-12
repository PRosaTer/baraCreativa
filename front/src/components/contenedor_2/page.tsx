"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-[667px] h-[750px] lg:h-[592px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-start gap-4">
 
      <div className="h-[350px] lg:h-[292px] w-full">
        <VideoSlider />
      </div>


      <div className="mt-auto h-[300px] lg:h-[192px] w-full">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;
