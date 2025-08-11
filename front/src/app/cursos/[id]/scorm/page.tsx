'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modulo } from '@/app/types/curso';

export function useCursoScorm(modulos: Modulo[]) {
  // Estados principales
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Función utilitaria para combinar todos los contenidos en una sola lista de URLs
  const getContenidoModulo = useCallback((modulo: Modulo) => {
    const urls: string[] = [];
    if (modulo.videoUrl) urls.push(...modulo.videoUrl);
    if (modulo.pdfUrl) urls.push(...modulo.pdfUrl);
    if (modulo.imageUrl) urls.push(...modulo.imageUrl);
    return urls;
  }, []);

  // Efecto para resetear el índice de contenido si el módulo cambia
  useEffect(() => {
    setCurrentContentIndex(0);
  }, [currentModuleIndex]);

  // Propiedades computadas basadas en el estado
  const currentModule = modulos[currentModuleIndex] || null;
  const allContents = currentModule ? getContenidoModulo(currentModule) : [];
  const currentContentUrl = allContents[currentContentIndex] || '';

  // Cálculo del progreso general (simulado)
  const progresoGeneral = useCallback(() => {
    if (modulos.length === 0) return 0;
    const totalContenidos = modulos.reduce((acc, mod) => acc + getContenidoModulo(mod).length, 0);
    const contenidosVistosAntes = modulos
      .slice(0, currentModuleIndex)
      .reduce((acc, mod) => acc + getContenidoModulo(mod).length, 0);
    const vistosEnModuloActual = currentContentIndex + 1;
    const vistosTotales = contenidosVistosAntes + vistosEnModuloActual;
    return totalContenidos > 0 ? (vistosTotales / totalContenidos) * 100 : 0;
  }, [modulos, currentModuleIndex, currentContentIndex, getContenidoModulo]);

  // Manejadores de eventos para la navegación
  const handleModuleClick = useCallback((modIndex: number) => {
    setCurrentModuleIndex(modIndex);
  }, []);

  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    if (!currentModule) return;
    
    const isLastContent = currentContentIndex === allContents.length - 1;
    const isLastModule = currentModuleIndex === modulos.length - 1;
    const isFirstContent = currentContentIndex === 0;
    const isFirstModule = currentModuleIndex === 0;

    if (direction === 'next') {
      if (!isLastContent) {
        setCurrentContentIndex(prev => prev + 1);
      } else if (!isLastModule) {
        setCurrentModuleIndex(prev => prev + 1);
        setCurrentContentIndex(0);
      }
    } else { // 'prev'
      if (!isFirstContent) {
        setCurrentContentIndex(prev => prev - 1);
      } else if (!isFirstModule) {
        const prevModule = modulos[currentModuleIndex - 1];
        const prevModuleContents = getContenidoModulo(prevModule);
        setCurrentModuleIndex(prev => prev - 1);
        setCurrentContentIndex(prevModuleContents.length - 1);
      }
    }
  }, [currentModuleIndex, currentContentIndex, modulos, currentModule, allContents, getContenidoModulo]);

  const isPrevContentDisabled = currentModuleIndex === 0 && currentContentIndex === 0;
  const isNextContentDisabled = !currentModule || allContents.length === 0 || (currentModuleIndex === modulos.length - 1 && currentContentIndex === allContents.length - 1);
  const cursoCompletadoGeneral = isNextContentDisabled; // Lógica simplificada para el ejemplo

  return {
    modulosDelCurso: modulos, // Cambiado 'modulos' a 'modulosDelCurso'
    currentModuleIndex,
    currentContentIndex,
    error: null,
    loading: false,
    cursoCompletadoGeneral,
    handleNavigation,
    handleModuleClick,
    progresoGeneral: progresoGeneral(),
    currentModule,
    currentContentUrl,
    isPrevContentDisabled,
    isNextContentDisabled,
  };
}
