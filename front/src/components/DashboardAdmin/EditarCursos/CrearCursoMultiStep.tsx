'use client';

import React, { useState, useEffect } from 'react';
import { Curso, CursoForm } from '@/app/types/curso';
import ScormUploader from './ScormUploader';

interface Props {
  onCursoCreado: (curso: Curso) => void;
  cursoInicial?: Curso;
  onCancelar: () => void;
}

export default function CrearCursoMultiStep({ onCursoCreado, cursoInicial, onCancelar }: Props) {
  const [cargando, setCargando] = useState(false);
  const [archivoScorm, setArchivoScorm] = useState<File | null>(null);



  const handleGuardar = async () => {
    if (!archivoScorm) {
      alert('Debés subir un archivo SCORM.');
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('archivoScorm', archivoScorm);

      const url = cursoInicial
        ? `http://localhost:3001/api/cursos/${cursoInicial.id}`
        : 'http://localhost:3001/api/cursos';

      const method = cursoInicial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Error al guardar el curso SCORM');
        setCargando(false);
        return;
      }

      const cursoGuardado: Curso = await res.json();
      onCursoCreado(cursoGuardado);
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert('Error desconocido');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <ScormUploader onUploadScormPackage={setArchivoScorm} />

      <div className="mt-6 flex justify-between">
        <button
          onClick={onCancelar}
          className="text-red-600 hover:underline"
          disabled={cargando}
        >
          Cancelar
        </button>

        <button
          onClick={handleGuardar}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : 'Guardar Curso SCORM'}
        </button>
      </div>
    </div>
  );
}
