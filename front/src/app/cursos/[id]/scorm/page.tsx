'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EstadoModuloUsuario } from '@/app/types/reporte-progreso.interface';

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id as string;
  const router = useRouter();

  const [modulosDelCurso, setModulosDelCurso] = useState<EstadoModuloUsuario[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [cursoCompletadoGeneral, setCursoCompletadoGeneral] = useState<boolean>(false);

  const markCourseAsCompletedGeneral = useCallback(async () => {
    if (cursoCompletadoGeneral) return;

    try {
      console.log(`Intentando marcar curso ${cursoId} como completado (general) en el backend.`);
      const res = await fetch(`http://localhost:3001/inscripciones/mark-completed/${cursoId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al marcar el curso general como completado: ${errorText}`);
      }
      setCursoCompletadoGeneral(true);
      console.log('Curso general marcado como completado en el backend.');
    } catch (e) {
      console.error("Error marcando el curso general como completado:", e);
      setError(e instanceof Error ? e.message : 'Error desconocido al completar el curso general.');
    }
  }, [cursoId, cursoCompletadoGeneral]);

  const marcarModuloCompletadoBackend = useCallback(async (moduloId: number) => {
    try {
      console.log(`Intentando marcar módulo ${moduloId} del curso ${cursoId} como completado en el backend.`);
      const res = await fetch(`http://localhost:3001/reportes-progreso/marcar-completado`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: Number(cursoId), moduloId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al marcar módulo ${moduloId} como completado.`);
      }

      console.log(`Módulo ${moduloId} marcado como completado en el backend.`);
      
     
      setModulosDelCurso(prevModulos =>
        prevModulos.map(m =>
          m.id === moduloId ? { ...m, completado: true, fechaCompletado: new Date() } : m
        )
      );

    } catch (e) {
      console.error("Error marcando módulo como completado:", e);
      setError(e instanceof Error ? e.message : 'Error desconocido al completar el módulo.');
    }
  }, [cursoId]); 


  useEffect(() => {
    const cargarDatosCursoYProgreso = async () => {
      try {
        setLoading(true);
        setError('');

        console.log(`Verificando acceso al curso ${cursoId}.`);
        const resInscripcion = await fetch(`http://localhost:3001/inscripciones/estado/${cursoId}`, {
          credentials: 'include',
        });
        if (!resInscripcion.ok) {
          throw new Error('No tienes acceso a este curso o no estás inscrito.');
        }
        const dataInscripcion: { estaInscripto: boolean; cursoCompletado?: boolean } = await resInscripcion.json();
        if (!dataInscripcion.estaInscripto) {
          setError('No tienes acceso a este curso.');
          setLoading(false);
          return;
        }
        
        if (dataInscripcion.cursoCompletado) {
          setCursoCompletadoGeneral(true);
        
        }

        console.log(`Obteniendo módulos y progreso para curso ${cursoId}.`);
        const resModulos = await fetch(`http://localhost:3001/reportes-progreso/estado/${cursoId}`, {
          credentials: 'include',
        });
        if (!resModulos.ok) {
          throw new Error('No se pudieron cargar los módulos del curso.');
        }
        const modulos: EstadoModuloUsuario[] = await resModulos.json();
        
        if (modulos.length === 0) {
          setError('Este curso no tiene módulos configurados.');
          setLoading(false);
          return;
        }

        setModulosDelCurso(modulos);

        const primerNoCompletadoIndex = modulos.findIndex(m => !m.completado);
        if (primerNoCompletadoIndex !== -1) {
          setCurrentModuleIndex(primerNoCompletadoIndex);
        } else {
          setCurrentModuleIndex(modulos.length - 1);
          if (!cursoCompletadoGeneral) {
            await markCourseAsCompletedGeneral();
          }
        }
        
        setLoading(false);

      } catch (e) {
        console.error("Error al cargar datos del curso:", e);
        setError(e instanceof Error ? e.message : 'Error inesperado al cargar el curso.');
        setLoading(false);
      }
    };

    cargarDatosCursoYProgreso();


    const handleMessage = async (event: MessageEvent) => {
      if (!IS_DEVELOPMENT_MODE && event.origin !== window.location.origin) {
        console.warn('Mensaje de origen desconocido bloqueado:', event.origin);
        return;
      }

      if (event.data && event.data.type === 'SCORM_COMPLETED' && event.data.courseId === cursoId) {
        console.log('Mensaje SCORM_COMPLETED recibido del iframe (SCORM real).');
        const currentModule = modulosDelCurso[currentModuleIndex];
        if (currentModule && currentModule.tipo === 'scorm' && !currentModule.completado) {
          await marcarModuloCompletadoBackend(currentModule.id);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [cursoId, marcarModuloCompletadoBackend, markCourseAsCompletedGeneral]);

  
  useEffect(() => {
    if (modulosDelCurso.length > 0 && !cursoCompletadoGeneral) {
      const allModulesCompletedLocally = modulosDelCurso.every(m => m.completado);
      if (allModulesCompletedLocally) {
        console.log('Detectado que todos los módulos están completados localmente. Marcando curso general.');
        markCourseAsCompletedGeneral();
      }
    }
  }, [modulosDelCurso, cursoCompletadoGeneral, markCourseAsCompletedGeneral]);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    const currentModule = modulosDelCurso[currentModuleIndex];
    if (!currentModule) return;


    if (currentModule.tipo !== 'scorm' && !currentModule.completado) {
      marcarModuloCompletadoBackend(currentModule.id);
    }

    if (direction === 'next' && currentModuleIndex < modulosDelCurso.length - 1) {
      setCurrentModuleIndex(prevIndex => prevIndex + 1);
    } else if (direction === 'prev' && currentModuleIndex > 0) {
      setCurrentModuleIndex(prevIndex => prevIndex - 1);
    }
  }, [currentModuleIndex, modulosDelCurso, marcarModuloCompletadoBackend]);

  const handleModuleClick = useCallback((index: number) => {
    const currentModule = modulosDelCurso[currentModuleIndex];


    if (currentModule && currentModule.tipo !== 'scorm' && !currentModule.completado) {
      marcarModuloCompletadoBackend(currentModule.id);
    }
    setCurrentModuleIndex(index);
  }, [currentModuleIndex, modulosDelCurso, marcarModuloCompletadoBackend]);

  const progresoGeneral = modulosDelCurso.length > 0
    ? Math.floor((modulosDelCurso.filter(m => m.completado).length / modulosDelCurso.length) * 100)
    : 0;

  const currentModule = modulosDelCurso[currentModuleIndex];

  if (loading) {
    return <p className="text-center text-lg mt-8 text-gray-700">Cargando curso y módulos...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center mt-8">{error}</p>;
  }

  if (!currentModule) {
    return <p className="text-center text-lg mt-8 text-gray-700">No hay módulos disponibles para este curso.</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 gap-4">
      <div className="lg:w-1/4 bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Módulos del Curso</h2>
        <div className="progress-bar-container w-full mb-4">
          <div className="progress-bar h-2 rounded-full bg-blue-500" style={{ width: `${progresoGeneral}%` }}></div>
          <p className="text-sm text-gray-600 text-right mt-1">{progresoGeneral}% Completado</p>
        </div>
        <ul className="flex-grow overflow-y-auto pr-2">
          {modulosDelCurso.map((modulo, index) => (
            <li
              key={modulo.id}
              onClick={() => handleModuleClick(index)}
              className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200
                ${index === currentModuleIndex ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold text-blue-800 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}
                ${modulo.completado ? 'line-through text-gray-500' : ''}`}
            >
              <span>{index + 1}. {modulo.titulo}</span>
              {modulo.completado ? (
                <span className="text-green-500 text-xl">✅</span>
              ) : (
                <span className="text-yellow-500 text-xl">⏳</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      
      <div className="lg:w-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col">
        {cursoCompletadoGeneral && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
            ¡Este curso ha sido completado! Puedes revisarlo cuantas veces quieras.
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentModule.titulo}</h1>
        <p className="text-gray-600 mb-6">{currentModule.descripcionContenido}</p>

        <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          {currentModule.tipo === 'scorm' && currentModule.urlContenido ? (
            <iframe
              src={currentModule.urlContenido}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              title={currentModule.titulo}
            />
          ) : currentModule.tipo === 'video' && currentModule.urlContenido ? (
            <video controls className="w-full h-full object-contain">
              <source src={currentModule.urlContenido} type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
          ) : currentModule.tipo === 'pdf' && currentModule.urlContenido ? (
            <iframe
              src={currentModule.urlContenido}
              className="w-full h-full"
              style={{ border: 'none' }}
              title={currentModule.titulo}
            />
          ) : currentModule.tipo === 'imagen' && currentModule.urlContenido ? (
            <img
              src={currentModule.urlContenido}
              alt={currentModule.titulo}
              className="max-w-full max-h-full object-contain"
            />
          ) : currentModule.tipo === 'texto' ? (
            <div className="p-4 text-gray-800 text-lg text-center">
              <p>{currentModule.descripcionContenido || 'Contenido de texto sin descripción adicional.'}</p>
            </div>
          ) : (
            <div className="p-4 text-red-500 text-lg text-center">
              <p>Contenido no disponible o tipo de módulo no reconocido.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={() => handleNavigation('prev')}
            disabled={currentModuleIndex === 0}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {currentModule.tipo !== 'scorm' && !currentModule.completado && (
            <button
              onClick={() => marcarModuloCompletadoBackend(currentModule.id)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
            >
              Marcar como Completado
            </button>
          )}
          <button
            onClick={() => handleNavigation('next')}
            disabled={currentModuleIndex === modulosDelCurso.length - 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>


        <div className="mt-6 text-center">
          <button
            onClick={markCourseAsCompletedGeneral}
            disabled={progresoGeneral < 100 || cursoCompletadoGeneral}
            className={`px-8 py-4 text-lg font-bold rounded-lg shadow-xl transition-all duration-300
              ${progresoGeneral === 100 && !cursoCompletadoGeneral
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
              }`}
          >
            {cursoCompletadoGeneral ? 'Curso Ya Completado' : 'Marcar Curso General como Completado'}
          </button>
        </div>
      </div>
    </div>
  );
}
