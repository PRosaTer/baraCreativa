'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

const IS_DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id as string;
  const router = useRouter();

  const [scormUrl, setScormUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [scormCompletedInBackend, setScormCompletedInBackend] = useState<boolean>(false);
  const [nextModuleData, setNextModuleData] = useState<{ url: string; tipo: string } | null>(null);

  const markCourseAsCompleted = useCallback(async () => {
    if (scormCompletedInBackend) return;

    try {
      const res = await fetch(`http://localhost:3001/inscripciones/mark-completed/${cursoId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al marcar el curso como completado: ${errorText}`);
      }
      setScormCompletedInBackend(true);
      console.log('Curso marcado como completado en el backend.');

      const nextMod = await fetchNextModule();
      if (nextMod) {
        setNextModuleData(nextMod);
      } else {
        console.warn('No hay siguiente módulo después de completar el SCORM.');
      }

    } catch (e) {
      console.error("Error marcando el curso como completado:", e);
      setError(e instanceof Error ? e.message : 'Error desconocido al completar el curso.');
    }
  }, [cursoId, scormCompletedInBackend]);

  const fetchNextModule = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${cursoId}/next-module`, {
        credentials: 'include',
      });

      if (!res.ok) {
        return null;
      }

      const data: { url: string; tipo: 'video' | 'pdf' | 'imagen' | 'scorm' | 'final' } = await res.json();
      return data;
    } catch (e) {
      console.error("Error al obtener el siguiente módulo:", e);
      return null;
    }
  }, [cursoId]);

  useEffect(() => {
    const verificarAccesoYObtenerScorm = async () => {
      try {
        const resInscripcion = await fetch(`http://localhost:3001/inscripciones/estado/${cursoId}`, {
          credentials: 'include',
        });
        if (!resInscripcion.ok) {
          throw new Error('No se pudo verificar la inscripción');
        }
        const data: { estaInscripto: boolean } = await resInscripcion.json();
        if (!data.estaInscripto) {
          setError('No tienes acceso a este curso');
          setLoading(false);
          return;
        }

        const resCurso = await fetch(`http://localhost:3001/api/cursos/${cursoId}`, {
          credentials: 'include',
        });
        if (!resCurso.ok) {
          throw new Error('No se pudo obtener información del curso');
        }
        const curso: { archivoScorm?: string; scormCompletadoUsuario?: boolean } = await resCurso.json();

        if (curso.scormCompletadoUsuario) {
          setScormCompletedInBackend(true);
          const nextMod = await fetchNextModule();
          if (nextMod) {
            setNextModuleData(nextMod);
          } else {
            setError('SCORM ya completado, pero no hay siguiente módulo o es el final del curso.');
          }
          setLoading(false);
          return;
        }

        if (!curso.archivoScorm) {
          throw new Error('Este curso no tiene SCORM configurado o no se encontró el archivo.');
        }

        const url = `http://localhost:3001${curso.archivoScorm}`;
        setScormUrl(url);
        setLoading(false);

      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Error inesperado al cargar el SCORM.');
        }
        setLoading(false);
      }
    };

    verificarAccesoYObtenerScorm();

    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'SCORM_COMPLETED' && event.data.courseId === cursoId) {
        console.log('Mensaje SCORM_COMPLETED recibido del iframe.');
        await markCourseAsCompleted();
      }
    };

    if (!IS_DEVELOPMENT_MODE) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      if (!IS_DEVELOPMENT_MODE) {
        window.removeEventListener('message', handleMessage);
      }
    };
  }, [cursoId, markCourseAsCompleted, fetchNextModule]);

  useEffect(() => {
    if (scormCompletedInBackend && nextModuleData && nextModuleData.url) {
      console.log(`Navegando al siguiente módulo: ${nextModuleData.url}`);
      router.push(nextModuleData.url);
    }
  }, [scormCompletedInBackend, nextModuleData, router]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Cargando curso y SCORM...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</p>;
  }

  if (scormCompletedInBackend && !nextModuleData) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <p>Has completado el SCORM de este curso.</p>
        <p>No hay más módulos disponibles o el curso ha finalizado.</p>
        <button
          onClick={() => router.push('/cursos')}
          style={{ padding: '10px 20px', fontSize: 16, marginTop: 20, cursor: 'pointer' }}
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  if (!scormUrl) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Preparando SCORM...</p>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={scormUrl}
        style={{ flexGrow: 1, border: 'none' }}
        allowFullScreen
        title="Contenido SCORM"
      />

      {IS_DEVELOPMENT_MODE && !scormCompletedInBackend && (
        <div style={{ padding: 10, backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p style={{marginBottom: '10px', color: '#555'}}>Modo Desarrollo: Usa este botón para simular la finalización del SCORM.</p>
          <button
            onClick={markCourseAsCompleted}
            style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Marcar SCORM como completado (DEV)
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}