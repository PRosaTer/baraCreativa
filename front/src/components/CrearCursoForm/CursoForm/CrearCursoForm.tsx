'use client';

import React, { useState } from 'react';
import CrearCursoPaso1 from '../../DashboardAdmin/EditarCursos/FormularioCursoPaso1';
import CrearCursoPaso2 from '../../DashboardAdmin/EditarCursos/FormularioCursoPaso2';
import { ModuloForm, Curso } from '@/app/types/curso';

interface Props {
  onCursoCreado: () => void;
  onCancelar: () => void;
}

export default function CrearCursoForm({ onCursoCreado, onCancelar }: Props) {
  const [paso, setPaso] = useState<number>(1);
  const [datos, setDatos] = useState<Omit<Curso, 'id' | 'modulos'>>({
    titulo: '',
    descripcion: '',
    precio: 0,
    duracionHoras: 0,
    tipo: '',
    modalidad: '',
    categoria: '',
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    archivoScorm: null,
    videoCurso: null,
    pdfCurso: null,
  });
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [modulos, setModulos] = useState<ModuloForm[]>([]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append('titulo', datos.titulo);
      formData.append('descripcion', datos.descripcion);
      formData.append('precio', datos.precio.toString());
      formData.append('duracionHoras', datos.duracionHoras.toString());
      formData.append('tipo', datos.tipo);
      formData.append('modalidad', datos.modalidad);
      formData.append('categoria', datos.categoria);
      formData.append('certificadoDisponible', datos.certificadoDisponible ? 'true' : 'false');
      formData.append('badgeDisponible', datos.badgeDisponible ? 'true' : 'false');

      if (imagenArchivo) {
        formData.append('imagenCurso', imagenArchivo);
      }

      modulos.forEach((mod, i) => {
        formData.append(`modulos[${i}][titulo]`, mod.titulo);
        formData.append(`modulos[${i}][descripcion]`, mod.descripcion);
        if (mod.videoUrl) formData.append(`modulos[${i}][videoUrl]`, mod.videoUrl);
        if (mod.pdfUrl) formData.append(`modulos[${i}][pdfUrl]`, mod.pdfUrl);
      });

      const res = await fetch('http://localhost:3001/api/cursos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error creando curso');

      onCursoCreado();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-2xl mx-auto">
      {paso === 1 && (
        <CrearCursoPaso1
          datos={datos}
          setDatos={setDatos}
          imagenArchivo={imagenArchivo}
          setImagenArchivo={setImagenArchivo}
          onNext={() => setPaso(2)}
        />
      )}

      {paso === 2 && (
        <CrearCursoPaso2 modulos={modulos} setModulos={setModulos} onSubmit={handleSubmit} />
      )}

      <button onClick={onCancelar} className="mt-4 text-gray-600 underline">
        Cancelar
      </button>
    </div>
  );
}
