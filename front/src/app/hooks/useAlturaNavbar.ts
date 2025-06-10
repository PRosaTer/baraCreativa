import { useState, useEffect } from 'react';

export const useAlturaNavbar = () => {
  const [alturaNavbar, setAlturaNavbar] = useState('80px');

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) {
      setAlturaNavbar(`${nav.offsetHeight}px`);
    }
  }, []);

  return alturaNavbar;
};