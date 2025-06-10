import { useState, useEffect } from 'react';

export const useAnimacionCompleta = (totalImagenes: number) => {
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [indiceVisible, setIndiceVisible] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    
    const timer = setTimeout(() => {
      setMostrarTodas(true);
    }, totalImagenes * 2000);

    return () => {
      document.documentElement.style.overflowX = '';
      clearTimeout(timer);
    };
  }, [totalImagenes]);

  useEffect(() => {
    if (!mostrarTodas && indiceVisible < totalImagenes - 1) {
      const timer = setTimeout(() => {
        setIndiceVisible(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!mostrarTodas) {
      setMostrarTodas(true);
    }
  }, [indiceVisible, mostrarTodas, totalImagenes]);

  return mostrarTodas ? totalImagenes : indiceVisible + 1;
};