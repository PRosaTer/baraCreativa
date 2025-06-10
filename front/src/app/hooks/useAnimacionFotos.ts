import { useState, useEffect } from 'react';
import { ListaImagenes } from './tipos';

export const useAnimacionFotos = (imagenes: ListaImagenes) => {
  const [indiceVisible, setIndiceVisible] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    return () => { document.documentElement.style.overflowX = ''; };
  }, []);

  useEffect(() => {
    if (indiceVisible < imagenes.length - 1) {
      const timer = setTimeout(() => {
        setIndiceVisible((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [indiceVisible, imagenes.length]);

  return indiceVisible;
};