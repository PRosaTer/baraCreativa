import { useEffect, useState } from "react";

export const useMostrarLienzo = (retardo: number = 12000) => {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrar(true);
    }, retardo);

    return () => clearTimeout(timer);
  }, [retardo]);

  return mostrar;
};
