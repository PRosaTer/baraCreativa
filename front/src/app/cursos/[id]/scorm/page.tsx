'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id;

  const [scormUrl, setScormUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

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
          return;
        }


        const resCurso = await fetch(`http://localhost:3001/api/cursos/${cursoId}`, {
          credentials: 'include',
        });

        if (!resCurso.ok) {
          throw new Error('No se pudo obtener información del curso');
        }

        const curso: { archivoScorm?: string } = await resCurso.json();

        if (!curso.archivoScorm) {
          throw new Error('Este curso no tiene SCORM configurado');
        }

    
        const url = `http://localhost:3001${curso.archivoScorm}`;
        setScormUrl(url);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Error inesperado');
        }
      }
    };

    verificarAccesoYObtenerScorm();
  }, [cursoId]);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</p>;
  }

  if (!scormUrl) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Cargando SCORM...</p>;
  }

  return (
    <iframe
      src={scormUrl}
      style={{ width: '100%', height: '90vh', border: 'none' }}
      allowFullScreen
    />
  );
}
