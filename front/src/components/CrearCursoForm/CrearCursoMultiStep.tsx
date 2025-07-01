'use client';

import React, { useState } from 'react';
import InformacionGeneral from './Pasos/InformacionGeneral';
import ModulosPaso from './Pasos/ModulosPaso';
import type { Curso, ModuloForm } from '@/app/types/curso';

interface Props {
  onCursoCreado: (curso: Curso) => void; 
  cursoInicial?: Curso;
  onCancelar: () => void;
}

export default function CrearCursoMultiStep({ onCursoCreado, cursoInicial, onCancelar }: Props) {
  const [paso, setPaso] = useState(1);


  const [cursoId, setCursoId] = useState<number | null>(cursoInicial?.id || null);

 
  const [titulo, setTitulo] = useState(cursoInicial?.titulo || '');
  const [descripcion, setDescripcion] = useState(cursoInicial?.descripcion || '');
  const [precio, setPrecio] = useState(cursoInicial?.precio?.toString() || '');
  const [duracionHoras, setDuracionHoras] = useState(cursoInicial?.duracionHoras?.toString() || '');
  const [tipo, setTipo] = useState<'Docentes' | 'Empresas'>(cursoInicial?.tipo || 'Docentes');
  const [modalidad, setModalidad] = useState<'en vivo' | 'grabado' | 'mixto'>(cursoInicial?.modalidad || 'en vivo');
  const [categoria, setCategoria] = useState(cursoInicial?.categoria || '');
  const [certificadoDisponible, setCertificadoDisponible] = useState(cursoInicial?.certificadoDisponible || false);
  const [badgeDisponible, setBadgeDisponible] = useState(cursoInicial?.badgeDisponible || false);


  const [imagenes, setImagenes] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [pdfs, setPdfs] = useState<File[]>([]);


  const [modulos, setModulos] = useState<ModuloForm[]>(cursoInicial?.modulos || []);

  /**
   * @function onAgregarModulo
   * @description 
   */
  const onAgregarModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '', videoUrl: null, pdfUrl: null }]);
  };

  /**
   * @function onModificarModulo
   * @description 
   * @param {number} index
   * @param {keyof ModuloForm} campo
   * @param {string | File | null} valor
   */
  const onModificarModulo = (index: number, campo: keyof ModuloForm, valor: string | File | null) => {
    const nuevos = [...modulos];
    if (campo === 'videoUrl' || campo === 'pdfUrl') {
      if (typeof valor === 'string' || valor === null) {
        nuevos[index][campo] = valor;
      } else {
        console.warn(`Intento de asignar un File a ${campo}. Se espera una URL (string) o null.`);
        nuevos[index][campo] = null;
      }
    } else {
      nuevos[index][campo] = valor as string;
    }
    setModulos(nuevos);
  };

  /**
   * @function onEliminarModulo
   * @description
   * @param {number} index
   */
  const onEliminarModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
  };

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario para crear o actualizar un curso.
   * Realiza una petición para los datos del curso y luego peticiones separadas para los archivos.
   */
  const handleSubmit = async () => {
    const cursoData = {
      titulo,
      descripcion,
      precio: parseFloat(precio),
      duracionHoras: parseInt(duracionHoras), 
      tipo,
      modalidad,
      categoria,
      certificadoDisponible,
      badgeDisponible,
      modulos,
    };

    const isEditing = !!cursoInicial?.id;
    let currentCursoId: number | null = cursoInicial?.id || null;
    try {
      const dataRes = await fetch(
        isEditing ? `http://localhost:3001/api/cursos/${currentCursoId}` : 'http://localhost:3001/api/cursos',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cursoData),
        }
      );

      if (!dataRes.ok) {
        const errorData = await dataRes.json();
        console.error('Error del servidor al guardar datos del curso:', errorData);
        throw new Error(errorData.message || 'Error al guardar los datos del curso');
      }

      const cursoGuardado = await dataRes.json();
      if (!isEditing) {
        currentCursoId = cursoGuardado.id;
        setCursoId(currentCursoId);
      }

   

      if (imagenes.length > 0 && currentCursoId) {
        const imagenFormData = new FormData();
        imagenFormData.append('imagen', imagenes[0]);
        const imgRes = await fetch(`http://localhost:3001/api/cursos/${currentCursoId}/imagen`, {
          method: 'POST',
          body: imagenFormData,
        });
        if (!imgRes.ok) {
          const errorData = await imgRes.json();
          console.error('Error al subir imagen:', errorData);
          alert(`Error al subir imagen: ${errorData.message || 'Desconocido'}`);
        } else {
          const imgData = await imgRes.json();

          cursoGuardado.imagenCurso = imgData.rutaImagen;
        }
      }


      if (videos.length > 0 && currentCursoId) {
        console.warn('La subida de videos del curso aún no está implementada en el backend.');

      }


      if (pdfs.length > 0 && currentCursoId) {
        console.warn('La subida de PDFs del curso aún no está implementada en el backend.');
  
      }


      onCursoCreado(cursoGuardado);

    } catch (error: unknown) {
      console.error('Error en handleSubmit:', error);
      alert(`Error en la operación del curso: ${(error instanceof Error) ? error.message : 'Desconocido'}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto">
      {paso === 1 && (
        <>
          <InformacionGeneral
            titulo={titulo}
            setTitulo={setTitulo}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            precio={precio}
            setPrecio={setPrecio}
            duracionHoras={duracionHoras}
            setDuracionHoras={setDuracionHoras}
            tipo={tipo}
            setTipo={setTipo}
            modalidad={modalidad}
            setModalidad={setModalidad}
            categoria={categoria}
            setCategoria={setCategoria}
            certificadoDisponible={certificadoDisponible}
            setCertificadoDisponible={setCertificadoDisponible}
            badgeDisponible={badgeDisponible}
            setBadgeDisponible={setBadgeDisponible}
            imagenes={imagenes}
            setImagenes={setImagenes}
            videos={videos}
            setVideos={setVideos}
            pdfs={pdfs}
            setPdfs={setPdfs}
          />
          <div className="flex justify-between mt-6">
            <button onClick={onCancelar} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
            <button onClick={() => setPaso(2)} className="bg-blue-600 text-white px-4 py-2 rounded">Siguiente</button>
          </div>
        </>
      )}

      {paso === 2 && (
        <>
          <ModulosPaso
            modulos={modulos}
            onAgregarModulo={onAgregarModulo}
            onModificarModulo={onModificarModulo}
            onEliminarModulo={onEliminarModulo}
          />
          <div className="flex justify-between mt-6">
            <button onClick={() => setPaso(1)} className="bg-gray-300 px-4 py-2 rounded">Volver</button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Guardar Curso</button>
          </div>
        </>
      )}
    </div>
  );
}
