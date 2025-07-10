'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ScormViewer() {
  const searchParams = useSearchParams();
  const pathParam = searchParams.get('path');

  const [completado, setCompletado] = useState(false);
  const [btnError, setBtnError] = useState<string | null>(null);

  if (!pathParam) return <p>Error: No se proporcionó la ruta del contenido SCORM.</p>;

  const scormUrl = decodeURIComponent(pathParam);

  function extraerCursoId(path: string): number {
    const partes = path.split('/');
    for (const p of partes) {
      const n = Number(p);
      if (!isNaN(n)) return n;
    }
    return 0;
  }

  const cursoId = extraerCursoId(scormUrl);

  async function marcarCursoCompletado() {
    try {
      const res = await fetch(`http://localhost:3001/inscripciones/mark-completed/${cursoId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Error marcando el curso como completado');
      setCompletado(true);
    } catch (e) {
      setBtnError((e as Error).message);
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={scormUrl}
        style={{ flexGrow: 1, border: 'none' }}
        title="Contenido SCORM"
      />
      <div style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
        {completado ? (
          <p>Curso marcado como completado. ¡Felicitaciones!</p>
        ) : (
          <>
            <button onClick={marcarCursoCompletado} style={{ padding: '10px 20px', fontSize: 16 }}>
              Marcar curso como completado
            </button>
            {btnError && <p style={{ color: 'red' }}>{btnError}</p>}
          </>
        )}
      </div>
    </div>
  );
}
