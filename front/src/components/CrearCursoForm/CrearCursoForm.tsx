'use client';

import React, { useState, useEffect } from 'react';
import Basicos from './Basicos';
import Avanzado from './Avanzado';
import { Curso } from '@/app/types/curso';


export interface ModuloForm {
  titulo: string;
  descripcion: string;
  videoFile?: File;
  pdfFile?: File;
  videoUrl?: string;
  pdfUrl?: string;
}

export interface CursoForm {
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: File;
  modulos: ModuloForm[];
}

interface Props {
  cursoInicial?: Curso;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancelar: () => void;
}

export default function CrearCursoForm({ cursoInicial, onSubmit, onCancelar }: Props) {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<CursoForm>({
    titulo: '',
    descripcion: '',
    tipo: 'Docentes',
    categoria: '',
    duracionHoras: 1,
    precio: 0,
    modalidad: 'en vivo',
    certificadoDisponible: false,
    badgeDisponible: false,
    modulos: [],
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cursoInicial) {
      setDatos({
        titulo: cursoInicial.titulo || '',
        descripcion: cursoInicial.descripcion || '',
        tipo: cursoInicial.tipo || 'Docentes',
        categoria: cursoInicial.categoria || '',
        duracionHoras: cursoInicial.duracionHoras || 1,
        precio: cursoInicial.precio || 0,
        modalidad: cursoInicial.modalidad || 'en vivo',
        certificadoDisponible: cursoInicial.certificadoDisponible ?? false,
        badgeDisponible: cursoInicial.badgeDisponible ?? false,
        imagenCurso: undefined,
        modulos: cursoInicial.modulos ? cursoInicial.modulos.map(m => ({
          titulo: m.titulo,
          descripcion: m.descripcion,
          videoFile: undefined,
          pdfFile: undefined, 
          videoUrl: m.videoUrl,
          pdfUrl: m.pdfUrl,
        })) : [],
      });
    }
  }, [cursoInicial]);

  const handleSubmitForm = async () => {
    setGuardando(true);
    try {
      const formData = new FormData();


      const dtoParaJson = {
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        categoria: datos.categoria,
        duracionHoras: datos.duracionHoras,
        precio: datos.precio,
        modalidad: datos.modalidad,
        certificadoDisponible: datos.certificadoDisponible,
        badgeDisponible: datos.badgeDisponible,
      };


      formData.append('crearCursoDto', JSON.stringify(dtoParaJson));
      if (datos.imagenCurso) {
        formData.append('imagenCurso', datos.imagenCurso);
      }

      const modulosData = datos.modulos.map((m, i) => ({
        titulo: m.titulo,
        descripcion: m.descripcion,
        videoUrl: m.videoFile ? `videoFile${i}` : m.videoUrl,
        pdfUrl: m.pdfFile ? `pdfFile${i}` : m.pdfUrl,
      }));

  
      formData.append('modulos', JSON.stringify(modulosData));
      datos.modulos.forEach((m, i) => {
        if (m.videoFile) formData.append(`videoFile${i}`, m.videoFile);
        if (m.pdfFile) formData.append(`pdfFile${i}`, m.pdfFile);
      });

      await onSubmit(formData);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="mt-6">
      {paso === 1 && (
        <Basicos
          datos={datos}
          setDatos={setDatos}
          onSiguiente={() => setPaso(2)}
          onCancelar={onCancelar}
        />
      )}
      {paso === 2 && (
        <Avanzado
          modulos={datos.modulos}
          setModulos={(action: React.SetStateAction<ModuloForm[]>) => {
            setDatos(prevDatos => ({
              ...prevDatos,
              modulos: typeof action === 'function' ? action(prevDatos.modulos) : action,
            }));
          }}
          imagenCurso={datos.imagenCurso || null}
          setImagenCurso={(action: React.SetStateAction<File | null>) => {
            setDatos(prevDatos => ({
              ...prevDatos,
              imagenCurso: typeof action === 'function'
                ? (action(prevDatos.imagenCurso || null) || undefined)
                : (action || undefined),
            }));
          }}
          onAnterior={() => setPaso(1)}
          onSubmit={handleSubmitForm}
          guardando={guardando}
        />
      )}
    </div>
  );
}