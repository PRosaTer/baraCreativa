"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-[667px] bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-start gap-4">
      {/* VideoSlider con altura justa */}
      <div className="w-full h-auto">
        <VideoSlider />
      </div>

      {/* ContenedorDeTestimonios con alturas responsivas */}
      <div
        className="
          mt-auto
          w-full
          h-[200px]     /* base */
          md:h-[300px]  /* +100px en md */
          lg:h-[250px]  /* intermedio en lg */
        "
      >
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;
