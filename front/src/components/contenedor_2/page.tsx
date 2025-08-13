"use client";

import React from "react";
import VideoSlider from "../contenedor_2/VideoSlider";
import ContenedorDeTestimonios from "./contenedorDeTestimonios";
import { useTamanoPantalla } from '../../app/hooks/testimonios/useTamanoPantalla';

const HeavyComponent = () => {
  const tamanoPantalla = useTamanoPantalla();

  const getAltura = () => {
    switch (tamanoPantalla) {
      case '2xl':
        return '575px';
      case 'xl':
        return '690px'; 
      case 'lg':
        return '600px'; 
      case 'md':
        return '600px';
      case 'sm':
      case 'xs':
      default:
        return '500px';
    }
  };

  return (
    <div
      className="w-full bg-gray-200 rounded-lg p-4 flex flex-col items-center gap-6 overflow-y-auto"
      style={{ height: getAltura() }}
    >
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
