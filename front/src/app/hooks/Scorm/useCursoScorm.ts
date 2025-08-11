'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modulo } from '@/app/types/curso';
import { EstadoModuloUsuario } from '@/app/types/scorm-types';

export function useCursoScorm(modulos: Modulo[]) {
    // Estados principales
    const [modulosEstadoUsuario, setModulosEstadoUsuario] = useState<EstadoModuloUsuario[]>([]);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);

    // Efecto para procesar los módulos iniciales y prepararlos para el estado de usuario
    useEffect(() => {
        const processedModulos: EstadoModuloUsuario[] = modulos.map((modulo, index) => {
            let tipo: 'video' | 'pdf' | 'imagen' | 'texto' | null = null;
            if (modulo.videoUrl && modulo.videoUrl.length > 0) tipo = 'video';
            else if (modulo.pdfUrl && modulo.pdfUrl.length > 0) tipo = 'pdf';
            else if (modulo.imageUrl && modulo.imageUrl.length > 0) tipo = 'imagen';
            else if (modulo.descripcion) tipo = 'texto';

            return {
                ...modulo,
                tipo,
                orden: index,
                completado: false,
                fechaCompletado: null,
            };
        });
        setModulosEstadoUsuario(processedModulos);
    }, [modulos]);

    // Función utilitaria para combinar todos los contenidos en una sola lista de URLs
    const getContenidoModulo = useCallback((modulo: Modulo) => {
        const urls: string[] = [];
        if (modulo.videoUrl) urls.push(...modulo.videoUrl);
        if (modulo.pdfUrl) urls.push(...modulo.pdfUrl);
        if (modulo.imageUrl) urls.push(...modulo.imageUrl);
        return urls;
    }, []);

    // Propiedades computadas basadas en el estado
    const currentModule = modulosEstadoUsuario[currentModuleIndex] || null;
    const allContents = currentModule ? getContenidoModulo(currentModule) : [];
    const currentContentUrl = allContents[currentContentIndex] || '';

    // Cálculo del progreso general
    const progresoGeneral = useCallback(() => {
        if (modulosEstadoUsuario.length === 0) return 0;
        const totalContenidos = modulosEstadoUsuario.reduce((acc, mod) => acc + getContenidoModulo(mod).length, 0);
        const contenidosVistosAntes = modulosEstadoUsuario
            .slice(0, currentModuleIndex)
            .reduce((acc, mod) => acc + getContenidoModulo(mod).length, 0);
        const vistosEnModuloActual = currentContentIndex + 1;
        const vistosTotales = contenidosVistosAntes + vistosEnModuloActual;
        return totalContenidos > 0 ? (vistosTotales / totalContenidos) * 100 : 0;
    }, [modulosEstadoUsuario, currentModuleIndex, currentContentIndex, getContenidoModulo]);

    // Manejadores de eventos para la navegación
    const handleModuleClick = useCallback((modIndex: number) => {
        if (modIndex >= 0 && modIndex < modulosEstadoUsuario.length) {
            setCurrentModuleIndex(modIndex);
            setCurrentContentIndex(0);
        }
    }, [modulosEstadoUsuario]);

    const handleNavigation = useCallback((direction: 'prev' | 'next') => {
        if (!currentModule) return;
        
        const isLastContent = currentContentIndex === allContents.length - 1;
        const isLastModule = currentModuleIndex === modulosEstadoUsuario.length - 1;
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
                const prevModule = modulosEstadoUsuario[currentModuleIndex - 1];
                const prevModuleContents = getContenidoModulo(prevModule);
                setCurrentModuleIndex(prev => prev - 1);
                setCurrentContentIndex(prevModuleContents.length - 1);
            }
        }
    }, [currentModuleIndex, currentContentIndex, modulosEstadoUsuario, currentModule, allContents, getContenidoModulo]);

    const disablePrev = currentModuleIndex === 0 && currentContentIndex === 0;
    const disableNext = !currentModule || allContents.length === 0 || (currentModuleIndex === modulosEstadoUsuario.length - 1 && currentContentIndex === allContents.length - 1);
    const cursoCompletadoGeneral = disableNext; // Lógica simplificada para el ejemplo

    return {
        modulosEstadoUsuario,
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
        disablePrev,
        disableNext,
    };
}
