"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";

const HeavyComponent = () => {
  return (
    <div className="w-full max-w-[667px] bg-gray-200 rounded-lg p-4 flex flex-col gap-4">
      {/* VideoSlider ocupa más espacio, con altura relativa y aspecto 16:9 */}
      <div className="w-full flex-shrink-0 aspect-video">
        <VideoSlider />
      </div>

      {/* ContenedorDeTestimonios ocupa espacio fijo responsivo */}
      <div className="
        w-full 
        h-[180px]          /* base */
        sm:h-[220px]       /* pequeño aumento en sm */
        md:h-[280px]       /* mediano */
        lg:h-[320px]       /* grande */
        xl:h-[350px]       /* extra grande */
      ">
        <ContenedorDeTestimonios />
      </div>
    </div>
  );
};

export default HeavyComponent;
