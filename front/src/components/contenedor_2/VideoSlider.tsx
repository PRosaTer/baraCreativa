'use client';

import { useState, useEffect } from "react";
import { usarNavegacionDeVideo } from "../../app/hooks/usarNavegacionDeVideo";
import { videosDeTestimonios } from "../../app/testimonios/videosDeTestimonios";
import { VideoActivo } from "./VideoActivo";
import { BotonNavegacion } from "./BotonNavegacion";

const VideoSlider = () => {
  const { indiceActual, videoSiguiente, videoAnterior } = usarNavegacionDeVideo(
    videosDeTestimonios.length
  );
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);

  useEffect(() => {
    setEstaReproduciendo(false);
  }, [indiceActual]);

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center justify-center max-w-[600px] mx-auto">
      <div className="w-full text-center py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white font-semibold rounded-t-lg select-none">
        {videosDeTestimonios[indiceActual].name}
      </div>
      <div className="relative w-full h-[550px] overflow-hidden rounded-lg">
        {videosDeTestimonios.map(
          ({ src }, index) =>
            index === indiceActual && (
              <div
                key={src}
                className="absolute z-20 scale-100 opacity-100 left-1/2 transform -translate-x-1/2 w-full h-full"
              >
                <VideoActivo
                  src={src}
                  reproduciendo={estaReproduciendo}
                  onPlay={() => setEstaReproduciendo(true)}
                  onPause={() => setEstaReproduciendo(false)}
                />
              </div>
            )
        )}
      </div>
      <BotonNavegacion
        direccion="izquierda"
        onClick={() => {
          videoAnterior();
          setEstaReproduciendo(false);
        }}
      />
      <BotonNavegacion
        direccion="derecha"
        onClick={() => {
          videoSiguiente();
          setEstaReproduciendo(false);
        }}
      />
    </div>
  );
};

export default VideoSlider;