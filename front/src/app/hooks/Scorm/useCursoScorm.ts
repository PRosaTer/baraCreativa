'use client';

import { useEffect, useState, useCallback } from 'react';
import { EstadoModuloUsuario } from '@/app/types/reporte-progreso.interface';
import { toast } from 'react-toastify';

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

export function useCursoScorm(cursoId: string) {
  const [modulosDelCurso, setModulosDelCurso] = useState<EstadoModuloUsuario[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cursoCompletadoGeneral, setCursoCompletadoGeneral] = useState<boolean>(false);

  const markCourseAsCompletedGeneral = useCallback(async () => {
    if (cursoCompletadoGeneral) return;

    try {
      const res = await fetch(`http://localhost:3001/inscripciones/mark-completed/${cursoId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      setCursoCompletadoGeneral(true);
      toast.success('🎉 Felicidades por completar el curso, ya tenes disponible el certificado en tu perfil', {
        position: 'top-center',
        autoClose: 4000,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al completar el curso.');
    }
  }, [cursoCompletadoGeneral, cursoId]);

  const marcarModuloCompletadoBackend = useCallback(
    async (moduloId: number) => {
      try {
        const res = await fetch(`http://localhost:3001/reportes-progreso/marcar-completado`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cursoId: Number(cursoId), moduloId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al marcar módulo.');
        }

        setModulosDelCurso((prev) =>
          prev.map((m) =>
            m.id === moduloId ? { ...m, completado: true, fechaCompletado: new Date() } : m
          )
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido.');
      }
    },
    [cursoId]
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const resInscripcion = await fetch(`http://localhost:3001/inscripciones/estado/${cursoId}`, {
          credentials: 'include',
        });
        if (!resInscripcion.ok) throw new Error('No tienes acceso.');
        const dataInscripcion = await resInscripcion.json();
        if (!dataInscripcion.estaInscripto) {
          setError('No estás inscrito.');
          setLoading(false);
          return;
        }

        if (dataInscripcion.cursoCompletado) setCursoCompletadoGeneral(true);

        const resModulos = await fetch(`http://localhost:3001/reportes-progreso/estado/${cursoId}`, {
          credentials: 'include',
        });
        if (!resModulos.ok) throw new Error('No se pudieron cargar los módulos.');
        const modulos: EstadoModuloUsuario[] = await resModulos.json();

        if (modulos.length === 0) {
          setError('Curso sin módulos.');
          setLoading(false);
          return;
        }

        setModulosDelCurso(modulos);

        const primerNoCompletadoIndex = modulos.findIndex((m) => !m.completado);
        if (primerNoCompletadoIndex !== -1) {
          setCurrentModuleIndex(primerNoCompletadoIndex);
        } else {
          setCurrentModuleIndex(modulos.length - 1);
          if (!cursoCompletadoGeneral) await markCourseAsCompletedGeneral();
        }

        setCurrentContentIndex(0);
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error inesperado.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cursoId, cursoCompletadoGeneral, markCourseAsCompletedGeneral]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!IS_DEVELOPMENT_MODE && event.origin !== window.location.origin) return;

      if (event.data?.type === 'SCORM_COMPLETED' && event.data.courseId === cursoId) {
        const currentModule = modulosDelCurso[currentModuleIndex];
        if (currentModule?.tipo === 'scorm' && !currentModule.completado) {
          await marcarModuloCompletadoBackend(currentModule.id);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [cursoId, currentModuleIndex, modulosDelCurso, marcarModuloCompletadoBackend]);

  useEffect(() => {
    if (modulosDelCurso.length && !cursoCompletadoGeneral) {
      const allComplete = modulosDelCurso.every((m) => m.completado);
      if (allComplete) {
        markCourseAsCompletedGeneral();
      }
    }
  }, [modulosDelCurso, cursoCompletadoGeneral, markCourseAsCompletedGeneral]);

  const getCurrentContentUrls = useCallback(() => {
    const module = modulosDelCurso[currentModuleIndex];
    if (!module) return [];

    switch (module.tipo) {
      case 'video':
        return module.videoUrls || [];
      case 'pdf':
        return module.pdfUrls || [];
      case 'imagen':
        return module.imageUrls || [];
      case 'scorm': 
        return module.urlContenido ? [module.urlContenido] : [];
      default:
        return [];
    }
  }, [modulosDelCurso, currentModuleIndex]);

  const handleNavigation = useCallback(
    (direction: 'next' | 'prev') => {
      const currentModule = modulosDelCurso[currentModuleIndex];
      if (!currentModule) return;

      const contentUrls = getCurrentContentUrls();
      const totalContentItems = contentUrls.length;

      if (currentModule.tipo !== 'scorm' && !currentModule.completado) {
        marcarModuloCompletadoBackend(currentModule.id);
      }

      if (direction === 'next') {
        if (currentContentIndex < totalContentItems - 1) {
          setCurrentContentIndex((i) => i + 1);
        }
        else if (currentModuleIndex < modulosDelCurso.length - 1) {
          toast.success(`✅ Módulo "${currentModule.titulo}" completado. Avanzando al siguiente.`, {
            position: 'top-center',
            autoClose: 3000,
          });
          setCurrentModuleIndex((i) => i + 1);
          setCurrentContentIndex(0);
        }
      } else if (direction === 'prev') {
        if (currentContentIndex > 0) {
          setCurrentContentIndex((i) => i - 1);
        }
        else if (currentModuleIndex > 0) {
          const prevIndex = currentModuleIndex - 1;
          setCurrentModuleIndex(prevIndex);
          const prevModule = modulosDelCurso[prevIndex];
          let totalPrevModuleContents = 0;
          switch (prevModule?.tipo) {
            case 'video':
              totalPrevModuleContents = prevModule.videoUrls?.length || 0;
              break;
            case 'pdf':
              totalPrevModuleContents = prevModule.pdfUrls?.length || 0;
              break;
            case 'imagen':
              totalPrevModuleContents = prevModule.imageUrls?.length || 0;
              break;
            case 'scorm':
              totalPrevModuleContents = prevModule.urlContenido ? 1 : 0;
              break;
            default:
              totalPrevModuleContents = 0;
          }
        
          setCurrentContentIndex(totalPrevModuleContents > 0 ? totalPrevModuleContents - 1 : 0);
        }
      }
    },
    [currentModuleIndex, currentContentIndex, modulosDelCurso, marcarModuloCompletadoBackend, getCurrentContentUrls]
  );

  const handleModuleClick = useCallback(
    (index: number) => {
      if (index > 0 && !modulosDelCurso[index - 1]?.completado) {
        toast.warn('Debes completar el módulo anterior primero.');
        return;
      }
      setCurrentModuleIndex(index);
      setCurrentContentIndex(0);
    },
    [modulosDelCurso]
  );

  const progresoGeneral = modulosDelCurso.length
    ? Math.floor((modulosDelCurso.filter((m) => m.completado).length / modulosDelCurso.length) * 100)
    : 0;

  const currentModule = modulosDelCurso[currentModuleIndex];
  const currentContentUrls = getCurrentContentUrls();
  const currentContentUrl = currentContentUrls[currentContentIndex];
  const isPrevContentDisabled = currentContentIndex === 0 && currentModuleIndex === 0;
  const isNextContentDisabled =
    currentContentIndex === (currentContentUrls.length > 0 ? currentContentUrls.length - 1 : 0) &&
    currentModuleIndex === modulosDelCurso.length - 1;

  return {
    modulosDelCurso,
    currentModuleIndex,
    setCurrentModuleIndex,
    currentContentIndex,
    setCurrentContentIndex,
    error,
    loading,
    cursoCompletadoGeneral,
    markCourseAsCompletedGeneral,
    marcarModuloCompletadoBackend,
    handleNavigation,
    handleModuleClick,
    progresoGeneral,
    currentModule,
    currentContentUrl,
    isPrevContentDisabled,
    isNextContentDisabled,
  };
}