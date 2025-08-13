import { useState, useEffect } from 'react';

const obtenerTamano = () => {
  const ancho = window.innerWidth;
  if (ancho >= 1536) return '2xl';
  if (ancho >= 1280) return 'xl';
  if (ancho >= 1024) return 'lg';
  if (ancho >= 768) return 'md';
  if (ancho >= 640) return 'sm';
  return 'xs';
};

export function useTamanoPantalla() {
  const [tamanoPantalla, setTamanoPantalla] = useState(obtenerTamano());

  useEffect(() => {
    const manejarCambioDeTamano = () => {
      setTamanoPantalla(obtenerTamano());
    };
    window.addEventListener('resize', manejarCambioDeTamano);
    return () => window.removeEventListener('resize', manejarCambioDeTamano);
  }, []);

  return tamanoPantalla;
}