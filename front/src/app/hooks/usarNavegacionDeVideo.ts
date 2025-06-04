import { useState } from "react";

export function usarNavegacionDeVideo(cantidadDeVideos: number) {
  const [indiceActual, setIndiceActual] = useState<number>(0);

  const videoSiguiente = (): void => {
    setIndiceActual((indiceActual + 1) % cantidadDeVideos);
  };

  const videoAnterior = (): void => {
    setIndiceActual((indiceActual - 1 + cantidadDeVideos) % cantidadDeVideos);
  };

  return {
    indiceActual,
    videoSiguiente,
    videoAnterior,
  };
}
