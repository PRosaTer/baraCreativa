"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div
      className="w-full max-w-[667px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-start gap-4 h-[800px]"
    >

      <div className="w-full h-auto">
        <VideoSlider />
      </div>


      <div className="mt-auto w-full h-[300px]">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;
