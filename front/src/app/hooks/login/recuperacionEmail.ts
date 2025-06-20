import { useEffect } from 'react';

interface UseRecuperacionEmailProps {
  onEmailFound: (email: string) => void;
}

export const useRecuperacionEmail = ({ onEmailFound }: UseRecuperacionEmailProps) => {
  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoRecuperacion");
    if (correoGuardado) {
      onEmailFound(correoGuardado);
      localStorage.removeItem("correoRecuperacion");
    }
  }, [onEmailFound]);
};