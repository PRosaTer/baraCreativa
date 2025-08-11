"use client";

import { useState, useEffect, useCallback } from "react";
import { Modulo } from "@/app/types/curso";

export function useCursoScorm(modulosIniciales: Modulo[]) {
  const [modulos, setModulos] = useState<Modulo[]>(modulosIniciales);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentContentUrl, setCurrentContentUrl] = useState("");
  const [progresoGeneral, setProgresoGeneral] = useState(0);

  const getContenidoModulo = useCallback((modulo: Modulo): string[] => {
    return [
      ...(modulo.videoUrl || []),
      ...(modulo.pdfUrl || []),
      ...(modulo.imageUrl || [])
    ];
  }, []);

  const calcularProgresoGeneral = useCallback(() => {
    const totalContenidos = modulos.reduce(
      (acc, modulo) => acc + getContenidoModulo(modulo).length,
      0
    );
    const contenidosVistosAntes = modulos
      .slice(0, currentModule)
      .reduce((acc, modulo) => acc + getContenidoModulo(modulo).length, 0);
    const vistosEnModuloActual = currentContentIndex + 1;
    const vistosTotales = contenidosVistosAntes + vistosEnModuloActual;

    return totalContenidos > 0 ? (vistosTotales / totalContenidos) * 100 : 0;
  }, [modulos, currentModule, currentContentIndex, getContenidoModulo]);

  useEffect(() => {
    setProgresoGeneral(calcularProgresoGeneral());
  }, [currentModule, currentContentIndex, calcularProgresoGeneral]);

  useEffect(() => {
    const modulo = modulos[currentModule];
    const contenidos = getContenidoModulo(modulo);
    setCurrentContentUrl(contenidos[currentContentIndex] || "");
  }, [modulos, currentModule, currentContentIndex, getContenidoModulo]);

  const isPrevContentDisabled = currentModule === 0 && currentContentIndex === 0;
  const isNextContentDisabled = (() => {
    const ultimoModulo = currentModule === modulos.length - 1;
    const contenidos = getContenidoModulo(modulos[currentModule]);
    const ultimoContenido = currentContentIndex === contenidos.length - 1;
    return ultimoModulo && ultimoContenido;
  })();

  const handleModuleClick = (modIndex: number) => {
    setCurrentModule(modIndex);
    setCurrentContentIndex(0);
  };

  const handleNavigation = (direction: "prev" | "next") => {
    const contenidos = getContenidoModulo(modulos[currentModule]);
    if (direction === "prev") {
      if (currentContentIndex > 0) {
        setCurrentContentIndex(prev => prev - 1);
      } else if (currentModule > 0) {
        const prevModuleIndex = currentModule - 1;
        const prevModuleContenidos = getContenidoModulo(modulos[prevModuleIndex]);
        setCurrentModule(prevModuleIndex);
        setCurrentContentIndex(prevModuleContenidos.length - 1);
      }
    } else {
      if (currentContentIndex < contenidos.length - 1) {
        setCurrentContentIndex(prev => prev + 1);
      } else if (currentModule < modulos.length - 1) {
        setCurrentModule(prev => prev + 1);
        setCurrentContentIndex(0);
      }
    }
  };

  return {
    modulos,
    currentModule,
    progresoGeneral,
    currentContentUrl,
    isPrevContentDisabled,
    isNextContentDisabled,
    handleModuleClick,
    handleNavigation
  };
}
