"use client";

import { useState, useEffect } from "react";
import { usarNavegacionDeVideo } from "../../app/hooks/usarNavegacionDeVideo";
import { videosDeTestimonios } from "../../app/testimonios/videosDeTestimonios";
import { VideoActivo } from "./VideoActivo";

const BotonNavegacion = ({
  direccion,
  onClick,
}: {
  direccion: "izquierda" | "derecha";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 ${
      direccion === "izquierda" ? "left-4" : "right-4"
    } bg-white rounded-full shadow-md w-12 h-12 flex items-center justify-center hover:scale-110 transition`}
  >
    <span className="text-2xl font-bold text-gray-700">
      {direccion === "izquierda" ? "←" : "→"}
    </span>
  </button>
);

const VideoSlider = () => {
  const { indiceActual, videoSiguiente, videoAnterior } = usarNavegacionDeVideo(
    videosDeTestimonios.length
  );
  const [estaReproduciendo, setEstaReproduciendo] = useState(false);

  useEffect(() => {
    setEstaReproduciendo(false);
  }, [indiceActual]);

  return (
    <div className="relative w-full h-[1000px] flex flex-col items-center justify-center max-w-[600px] mx-auto">
      {/* Título */}
      <div className="w-full text-center py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white font-semibold rounded-t-lg select-none text-xl">
        {videosDeTestimonios[indiceActual].name}
      </div>

      {/* Contenedor de video */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
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

        {/* Botones */}
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
    </div>
  );
};

export default VideoSlider;
