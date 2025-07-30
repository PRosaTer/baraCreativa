'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { EstadoModuloUsuario } from '@/app/types/reporte-progreso.interface';
import { toast } from 'react-toastify';

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';
const BACKEND_BASE_URL = 'http://localhost:3001'; 
const BACKEND_ORIGIN = new URL(BACKEND_BASE_URL).origin;

const SCORM_VIRTUAL_MODULE_ID_OFFSET = 1000000; 

export function useCursoScorm(cursoId: string) {
  console.log('[useCursoScorm] Hook inicializado para cursoId:', cursoId); 

  const [modulosDelCurso, setModulosDelCurso] = useState<EstadoModuloUsuario[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cursoCompletadoGeneral, setCursoCompletadoGeneral] = useState<boolean>(false);

  const markCourseAsCompletedGeneral = useCallback(async () => {
    console.log('[markCourseAsCompletedGeneral] Intentando marcar el curso como completado general.');
    if (cursoCompletadoGeneral) {
      console.log('[markCourseAsCompletedGeneral] Curso ya marcado como completado, saliendo.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken'); 
      const headers: HeadersInit = { 
        'Content-Type': 'application/json'
      };
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`[markCourseAsCompletedGeneral] Realizando fetch POST a ${BACKEND_BASE_URL}/inscripciones/mark-completed/${cursoId}`);
      const res = await fetch(`${BACKEND_BASE_URL}/inscripciones/mark-completed/${cursoId}`, {
        method: 'POST',
        credentials: 'include',
        headers: headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[markCourseAsCompletedGeneral] Error en la respuesta del backend:', errorText);
        throw new Error(errorText);
      }
      setCursoCompletadoGeneral(true);
      console.log('[markCourseAsCompletedGeneral] Curso marcado como completado general exitosamente.');
      toast.success('🎉 Felicidades por completar el curso, ya tenes disponible el certificado en tu perfil', {
        position: 'top-center',
        autoClose: 4000,
      });
    } catch (e) {
      console.error('[markCourseAsCompletedGeneral] Error al completar el curso:', e);
      setError(e instanceof Error ? e.message : 'Error al completar el curso.');
      toast.error(`Error al marcar el curso como completado: ${e instanceof Error ? e.message : 'Desconocido'}`);
    }
  }, [cursoCompletadoGeneral, cursoId]);

  const marcarModuloCompletadoBackend = useCallback(
    async (moduloId: number) => {
      if (moduloId <= 0) {
        console.warn('[marcarModuloCompletadoBackend] Intento de marcar un módulo con ID inválido:', moduloId);
        return;
      }

      try {
        const token = localStorage.getItem('accessToken'); 
        const headers: HeadersInit = { 
          'Content-Type': 'application/json'
        };
        if (token) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        console.log(`[marcarModuloCompletadoBackend] Realizando fetch POST para moduloId: ${moduloId}, cursoId: ${cursoId}`);
        const res = await fetch(`${BACKEND_BASE_URL}/reportes-progreso/marcar-completado`, {
          method: 'POST',
          credentials: 'include',
          headers: headers,
          body: JSON.stringify({ cursoId: Number(cursoId), moduloId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('[marcarModuloCompletadoBackend] Error en la respuesta del backend al marcar módulo:', errorData);
          throw new Error(errorData.message || 'Error al marcar módulo.');
        }

        setModulosDelCurso((prev) => {
          const updatedModulos = prev.map((m) =>
            m.id === moduloId ? { ...m, completado: true, fechaCompletado: new Date() } : m
          );
          console.log(`[marcarModuloCompletadoBackend] Estado local de módulos actualizado. Módulo ${moduloId} ahora completado.`);
          return updatedModulos;
        });
        toast.success(`✅ Módulo completado.`, {
            position: 'top-center',
            autoClose: 3000,
        });
      } catch (e) {
        console.error('[marcarModuloCompletadoBackend] Error al marcar módulo en backend:', e);
        setError(e instanceof Error ? e.message : 'Error desconocido al marcar módulo en backend.');
        toast.error(`Error al marcar el módulo como completado: ${e instanceof Error ? e.message : 'Desconocido'}`);
      }
    },
    [cursoId]
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken'); 
        const headers: HeadersInit = { 
          'Content-Type': 'application/json'
        };
        if (token) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const resInscripcion = await fetch(`${BACKEND_BASE_URL}/inscripciones/estado/${cursoId}`, {
          credentials: 'include',
          headers: headers,
        });
        if (!resInscripcion.ok) {
          const errorData = await resInscripcion.json();
          throw new Error(errorData.message || 'No tienes acceso.');
        }
        const dataInscripcion = await resInscripcion.json();
        if (!dataInscripcion.estaInscripto) {
          setError('No estás inscrito.');
          setLoading(false);
          return;
        }

        if (dataInscripcion.cursoCompletado) {
          setCursoCompletadoGeneral(true);
          console.log('[useCursoScorm] Curso ya marcado como completado en la inscripción inicial.');
        }

        const resModulos = await fetch(`${BACKEND_BASE_URL}/reportes-progreso/estado/${cursoId}`, {
          credentials: 'include',
          headers: headers,
        });
        if (!resModulos.ok) {
          const errorData = await resModulos.json();
          throw new Error(errorData.message || 'No se pudieron cargar los módulos.');
        }
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
          if (!dataInscripcion.cursoCompletado) { 
            console.log('[useCursoScorm] Todos los módulos cargados están completados. Intentando marcar curso general si no lo estaba.');
            await markCourseAsCompletedGeneral();
          }
        }

        setCurrentContentIndex(0);
        setLoading(false);
      } catch (e) {
        console.error('[useCursoScorm] Error al cargar datos iniciales:', e);
        setError(e instanceof Error ? e.message : 'Error inesperado.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cursoId, markCourseAsCompletedGeneral]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log('[useCursoScorm] Mensaje recibido del iframe:', event.data); 
      if (!IS_DEVELOPMENT_MODE && event.origin !== BACKEND_ORIGIN) {
        console.warn(`Mensaje SCORM ignorado: Origen no permitido (${event.origin}). Esperado: ${BACKEND_ORIGIN}`);
        return;
      }

      if (event.data?.type === 'SCORM_COMPLETED' && event.data.courseId === Number(cursoId)) {
        const currentModule = modulosDelCurso[currentModuleIndex];
        if (currentModule?.tipo === 'scorm' && !currentModule.completado) {
          console.log(`[useCursoScorm] Mensaje SCORM_COMPLETED recibido para módulo ${currentModule.id}. Marcando como completado.`);
          await marcarModuloCompletadoBackend(currentModule.id); 
        } else if (currentModule?.tipo === 'scorm' && currentModule.completado) {
          console.warn('[useCursoScorm] Mensaje SCORM recibido, pero el módulo ya estaba completado.', currentModule);
        } else {
            console.warn('[useCursoScorm] Mensaje SCORM recibido, pero el módulo actual no es SCORM o no es el curso correcto.', currentModule);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [cursoId, currentModuleIndex, modulosDelCurso, marcarModuloCompletadoBackend]);

  useEffect(() => {
    if (modulosDelCurso.length && !cursoCompletadoGeneral) {
      const allComplete = modulosDelCurso.every((m) => m.completado);
      console.log(`[useCursoScorm - useEffect: modulosDelCurso] Verificando estado local de módulos. Todos completados: ${allComplete}. Estado actual de cursoCompletadoGeneral: ${cursoCompletadoGeneral}`);
      if (allComplete) {
        console.log('[useCursoScorm - useEffect: modulosDelCurso] Todos los módulos locales marcados como completados. DISPARANDO markCourseAsCompletedGeneral.');
        markCourseAsCompletedGeneral();
      } else {
        console.log('[useCursoScorm - useEffect: modulosDelCurso] No todos los módulos locales están completados. Faltan:', modulosDelCurso.filter(m => !m.completado).map(m => m.titulo));
      }
    }
  }, [modulosDelCurso, cursoCompletadoGeneral, markCourseAsCompletedGeneral]);

  const getCurrentContentUrls = useCallback(() => {
    const module = modulosDelCurso[currentModuleIndex];
    if (!module) return [];

    let urls: string[] = [];
    switch (module.tipo) {
      case 'video':
        urls = module.videoUrls || [];
        break;
      case 'pdf':
        urls = module.pdfUrls || [];
        break;
      case 'imagen':
        urls = module.imageUrls || [];
        break;
      case 'scorm':
        urls = module.urlContenido ? [module.urlContenido] : [];
        break;
      case 'texto': 
        urls = [];
        break;
      default:
        urls = [];
    }
    console.log(`[getCurrentContentUrls] Module: ${module.titulo} (ID: ${module.id}), Type: ${module.tipo}, URLs found: ${urls.length}`);
    return urls;
  }, [modulosDelCurso, currentModuleIndex]);

  const handleNavigation = useCallback(
    async (direction: 'next' | 'prev') => { 
      const currentModule = modulosDelCurso[currentModuleIndex];
      if (!currentModule) return;

      const contentUrls = getCurrentContentUrls();
      const totalContentItems = contentUrls.length;

      console.log(`[handleNavigation START] Direction: ${direction}, Module: ${currentModule.titulo} (ID: ${currentModule.id}), Type: ${currentModule.tipo}, Current Content Index: ${currentContentIndex}, Total Content Items: ${totalContentItems}, Module Index: ${currentModuleIndex} / ${modulosDelCurso.length - 1}`);


      if (direction === 'next') {
        const isLastContentOfCurrentModule = currentContentIndex === totalContentItems - 1 || totalContentItems === 0;
        const isLastModule = currentModuleIndex === modulosDelCurso.length - 1;

        console.log(`[handleNavigation - NEXT] isLastContentOfCurrentModule: ${isLastContentOfCurrentModule}, isLastModule: ${isLastModule}, currentModule.completado: ${currentModule.completado}`);

     
        if (isLastContentOfCurrentModule && !currentModule.completado) { 
            console.log(`[handleNavigation - NEXT] Último contenido del módulo ${currentModule.id}. Marcando módulo como completado.`);
            await marcarModuloCompletadoBackend(currentModule.id); 
            console.log(`[handleNavigation - NEXT] Después de marcar módulo ${currentModule.id}: modulosDelCurso (local state):`, modulosDelCurso.map(m => ({ id: m.id, completado: m.completado, titulo: m.titulo })));
        }
        
  
        if (isLastContentOfCurrentModule && isLastModule) {
            console.log('[handleNavigation - NEXT] Último módulo y último contenido alcanzado. DISPARANDO markCourseAsCompletedGeneral directamente.');

            await markCourseAsCompletedGeneral();
        } else if (isLastContentOfCurrentModule) { 
            console.log(`[handleNavigation - NEXT] Navegando al siguiente módulo.`);
            setCurrentModuleIndex((i) => i + 1);
            setCurrentContentIndex(0);
        } else { 
          console.log(`[handleNavigation - NEXT] Navegando al siguiente contenido dentro del mismo módulo.`);
          setCurrentContentIndex((i) => i + 1);
        }
      } else if (direction === 'prev') {
        if (currentContentIndex > 0) {
          console.log(`[handleNavigation - PREV] Navegando al contenido anterior dentro del mismo módulo.`);
          setCurrentContentIndex((i) => i - 1);
        } else if (currentModuleIndex > 0) {
          console.log(`[handleNavigation - PREV] Navegando al módulo anterior.`);
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
            case 'texto': 
              totalPrevModuleContents = prevModule.descripcionContenido ? 1 : 0;
              break;
            default:
              totalPrevModuleContents = 0;
          }
          setCurrentContentIndex(totalPrevModuleContents > 0 ? totalPrevModuleContents - 1 : 0);
        }
      }
    },
    [currentModuleIndex, currentContentIndex, modulosDelCurso, marcarModuloCompletadoBackend, getCurrentContentUrls, markCourseAsCompletedGeneral] 
  );

  const handleModuleClick = useCallback(
    (index: number) => {
      const currentModule = modulosDelCurso[currentModuleIndex];
      
      if (currentModule && !currentModule.completado && index !== currentModuleIndex) {
        const contentUrls = getCurrentContentUrls();
        const totalContentItems = contentUrls.length;
        const isLastContent = currentContentIndex === totalContentItems - 1 || totalContentItems === 0;

        if (currentModule.tipo === 'scorm' || currentModule.tipo === 'texto' || isLastContent) {
            console.log(`[handleModuleClick] Módulo ${currentModule.id} marcado como completado al navegar a otro módulo.`);
            marcarModuloCompletadoBackend(currentModule.id).catch(e => {
                console.error("[handleModuleClick] Error al marcar módulo en handleModuleClick:", e);
                toast.error("Hubo un error al marcar el módulo actual.");
            });
        }
      }

      if (index > 0 && !modulosDelCurso[index - 1]?.completado && !modulosDelCurso[index]?.completado) {
        toast.warn('Debes completar el módulo anterior primero para acceder a este, o este módulo debe estar ya completado.');
        return;
      }
      
      setCurrentModuleIndex(index);
      setCurrentContentIndex(0);
    },
    [modulosDelCurso, currentModuleIndex, currentContentIndex, marcarModuloCompletadoBackend, getCurrentContentUrls] 
  );

  const progresoGeneral = useMemo(() => {
    if (!modulosDelCurso.length) return 0;

    let totalContenidosEnCurso = 0;
    let contenidosCompletadosCalculados = 0;

    modulosDelCurso.forEach((modulo, index) => {
      let cantidadContenidosEnModulo = 0;
      switch (modulo.tipo) {
        case 'video':
          cantidadContenidosEnModulo = modulo.videoUrls?.length || 0;
          break;
        case 'pdf':
          cantidadContenidosEnModulo = modulo.pdfUrls?.length || 0;
          break;
        case 'imagen':
          cantidadContenidosEnModulo = modulo.imageUrls?.length || 0;
          break;
        case 'scorm':
          cantidadContenidosEnModulo = modulo.urlContenido ? 1 : 0; 
          break;
        case 'texto':
          cantidadContenidosEnModulo = modulo.descripcionContenido ? 1 : 0;
          break;
      }

      totalContenidosEnCurso += cantidadContenidosEnModulo;

      if (modulo.completado) {
        contenidosCompletadosCalculados += cantidadContenidosEnModulo;
      } else if (index === currentModuleIndex) {
        contenidosCompletadosCalculados += Math.min(currentContentIndex + 1, cantidadContenidosEnModulo);
      }
    });

    if (totalContenidosEnCurso === 0) return 0;

    const progresoCalculado = (contenidosCompletadosCalculados / totalContenidosEnCurso) * 100;
    return Math.floor(Math.min(progresoCalculado, 100));
  }, [modulosDelCurso, currentModuleIndex, currentContentIndex]);

  const currentModule = modulosDelCurso[currentModuleIndex];

  const memoizedCurrentContentUrls = useMemo(() => getCurrentContentUrls(), [getCurrentContentUrls]);
  const currentContentUrl = memoizedCurrentContentUrls[currentContentIndex];

  const isPrevContentDisabled = currentContentIndex === 0 && currentModuleIndex === 0;
  
  const isNextContentDisabled =
    currentModule && 
    currentContentIndex === (currentModule.tipo === 'texto' ? 0 : memoizedCurrentContentUrls.length - 1) && 
    currentModuleIndex === modulosDelCurso.length - 1 &&
    currentModule.completado;


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
