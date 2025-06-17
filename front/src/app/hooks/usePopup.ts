import { useState } from "react";

export const usePopup = () => {
  const [mostrar, setMostrar] = useState(false);
  const toggle = () => setMostrar(!mostrar);

  return { mostrar, toggle };
};
