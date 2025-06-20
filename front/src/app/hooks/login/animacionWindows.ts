import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseAnimacionWindowsProps {
  onSuccessRedirectPath: string;
  exitAnimationDuration?: number;
  delayBeforeRedirect?: number;
}

export const useAnimacionWindows = ({
  onSuccessRedirectPath,
  exitAnimationDuration = 800,
  delayBeforeRedirect = 1500,
}: UseAnimacionWindowsProps) => {
  const router = useRouter();
  const [mostrarVentana, setMostrarVentana] = useState(true);

  const iniciarTransicionYRedireccion = useCallback(() => {
    setTimeout(() => {
      setMostrarVentana(false);
      setTimeout(() => router.push(onSuccessRedirectPath), exitAnimationDuration);
    }, delayBeforeRedirect);
  }, [onSuccessRedirectPath, exitAnimationDuration, delayBeforeRedirect, router]);

  return {
    mostrarVentana,
    iniciarTransicionYRedireccion,
  };
};