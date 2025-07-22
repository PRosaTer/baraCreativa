'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { EstadoModuloUsuario } from '@/app/types/reporte-progreso.interface';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id as string;

  const [modulosDelCurso, setModulosDelCurso] = useState<EstadoModuloUsuario[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [currentContentIndex, setCurrentContentIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cursoCompletadoGeneral, setCursoCompletadoGeneral] = useState<boolean>(false);

  // Marca el curso como completado y genera certificado (backend)
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
  }, [cursoId, cursoCompletadoGeneral]);

  // Marca módulo como completado en backend
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

  // Carga datos iniciales del curso y módulos
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

        // Posicionar en primer módulo no completado o último si todos completados
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
  }, [cursoId, markCourseAsCompletedGeneral, cursoCompletadoGeneral]);

  // Escuchar mensajes para marcar módulos SCORM completados
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

  // Cuando modulos cambian, revisar si curso completo
  useEffect(() => {
    if (modulosDelCurso.length && !cursoCompletadoGeneral) {
      const allComplete = modulosDelCurso.every((m) => m.completado);
      if (allComplete) {
        markCourseAsCompletedGeneral();
      }
    }
  }, [modulosDelCurso, cursoCompletadoGeneral, markCourseAsCompletedGeneral]);

  // URLs del contenido actual
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
      default:
        return [];
    }
  }, [modulosDelCurso, currentModuleIndex]);

  // Navegación de contenido y módulos
  const handleNavigation = useCallback(
    (direction: 'next' | 'prev') => {
      const currentModule = modulosDelCurso[currentModuleIndex];
      if (!currentModule) return;

      const contentUrls = getCurrentContentUrls();
      const totalContentItems = contentUrls.length;

      // Marca módulo como completado si no es SCORM y aún no marcado
      if (currentModule.tipo !== 'scorm' && !currentModule.completado) {
        marcarModuloCompletadoBackend(currentModule.id);
      }

      if (direction === 'next') {
        if (currentContentIndex < totalContentItems - 1) {
          setCurrentContentIndex((i) => i + 1);
        } else if (currentModuleIndex < modulosDelCurso.length - 1) {
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
        } else if (currentModuleIndex > 0) {
          const prevIndex = currentModuleIndex - 1;
          setCurrentModuleIndex(prevIndex);
          const prevModule = modulosDelCurso[prevIndex];
          let total = 0;
          if (prevModule?.tipo === 'video') total = prevModule.videoUrls?.length || 0;
          else if (prevModule?.tipo === 'pdf') total = prevModule.pdfUrls?.length || 0;
          else if (prevModule?.tipo === 'imagen') total = prevModule.imageUrls?.length || 0;
          setCurrentContentIndex(total > 0 ? total - 1 : 0);
        }
      }
    },
    [currentModuleIndex, currentContentIndex, modulosDelCurso, marcarModuloCompletadoBackend, getCurrentContentUrls]
  );

  // Click en módulo sólo si módulo anterior completado
  const handleModuleClick = useCallback(
    (index: number) => {
      // Sólo permitir acceder si el módulo anterior está completado
      if (index > 0 && !modulosDelCurso[index - 1]?.completado) {
        toast.warn('Debes completar el módulo anterior primero.');
        return;
      }
      setCurrentModuleIndex(index);
      setCurrentContentIndex(0);
    },
    [modulosDelCurso]
  );

  // Porcentaje general curso
  const progresoGeneral = modulosDelCurso.length
    ? Math.floor((modulosDelCurso.filter((m) => m.completado).length / modulosDelCurso.length) * 100)
    : 0;

  const currentModule = modulosDelCurso[currentModuleIndex];
  const currentContentUrls = getCurrentContentUrls();
  const currentContentUrl = currentContentUrls[currentContentIndex];

  const isPrevContentDisabled = currentContentIndex === 0 && currentModuleIndex === 0;
  const isNextContentDisabled =
    currentContentIndex === currentContentUrls.length - 1 && currentModuleIndex === modulosDelCurso.length - 1;

  if (loading) return <p className="text-center mt-8">Cargando curso...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
  if (!currentModule) return <p className="text-center mt-8">No hay módulos.</p>;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 gap-4">
        <div className="lg:w-1/4 bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Módulos</h2>
          <div className="progress-bar-container w-full mb-4">
            <div className="progress-bar h-2 rounded-full bg-blue-500" style={{ width: `${progresoGeneral}%` }}></div>
            <p className="text-sm text-right mt-1">{progresoGeneral}% Completado</p>
          </div>
          <ul className="flex-grow overflow-y-auto pr-2">
            {modulosDelCurso.map((modulo, index) => (
              <li
                key={modulo.id}
                onClick={() => handleModuleClick(index)}
                className={`p-3 mb-2 rounded-lg cursor-pointer ${
                  index === currentModuleIndex
                    ? 'bg-blue-100 font-semibold text-blue-800'
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${modulo.completado ? 'line-through text-gray-500' : ''}`}
              >
                {index + 1}. {modulo.titulo}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          {cursoCompletadoGeneral && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
              Felicidades por completar el curso, ya tenes disponible el certificado en tu perfil
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{currentModule.titulo}</h1>
          <p className="text-gray-600 mb-6">{currentModule.descripcionContenido}</p>

          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border">
            {currentModule.tipo === 'scorm' && currentModule.urlContenido ? (
              <iframe src={currentModule.urlContenido} style={{ width: '100%', height: '100%' }} />
            ) : currentModule.tipo === 'video' && currentContentUrl ? (
              <video key={currentContentUrl} controls className="w-full h-full object-contain">
                <source src={currentContentUrl} type="video/mp4" />
              </video>
            ) : currentModule.tipo === 'pdf' && currentContentUrl ? (
              <iframe src={currentContentUrl} className="w-full h-full" />
            ) : currentModule.tipo === 'imagen' && currentContentUrl ? (
              <img src={currentContentUrl} alt={currentModule.titulo} className="max-w-full max-h-full object-contain" />
            ) : currentModule.tipo === 'texto' ? (
              <div className="p-4 text-center">{currentModule.descripcionContenido}</div>
            ) : (
              <div className="p-4 text-red-500 text-center">Contenido no disponible.</div>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={isPrevContentDisabled}
              className="px-6 py-3 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {currentModule.tipo !== 'scorm' && !currentModule.completado && (
              <button
                onClick={() => marcarModuloCompletadoBackend(currentModule.id)}
                className="px-6 py-3 bg-green-500 text-white rounded"
              >
                Marcar como Completado
              </button>
            )}

            <button
              onClick={() => handleNavigation('next')}
              disabled={isNextContentDisabled}
              className="px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={markCourseAsCompletedGeneral}
              disabled={progresoGeneral < 100 || cursoCompletadoGeneral}
              className={`px-8 py-4 text-lg font-bold rounded transition ${
                progresoGeneral === 100 && !cursoCompletadoGeneral
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {cursoCompletadoGeneral ? 'Curso Ya Completado' : 'Marcar Curso como Completado'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
