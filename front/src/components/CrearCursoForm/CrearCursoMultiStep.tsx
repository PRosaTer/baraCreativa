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

  const onAgregarModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '', videoUrl: null, pdfUrl: null }]);
  };

  const onModificarModulo = (index: number, campo: keyof ModuloForm, valor: string | File | null) => {
    const nuevos = [...modulos];
    if (campo === 'videoUrl' || campo === 'pdfUrl') {
      if (typeof valor === 'string' || valor === null) {
        nuevos[index][campo] = valor;
      } else {
        nuevos[index][campo] = null;
      }
    } else {
      nuevos[index][campo] = valor as string;
    }
    setModulos(nuevos);
  };

  const onEliminarModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('duracionHoras', duracionHoras);
    formData.append('tipo', tipo);
    formData.append('modalidad', modalidad);
    formData.append('categoria', categoria);
    formData.append('certificadoDisponible', certificadoDisponible.toString());
    formData.append('badgeDisponible', badgeDisponible.toString());

    imagenes.forEach((file) => formData.append('imagenes', file));
    videos.forEach((file) => formData.append('videos', file));
    pdfs.forEach((file) => formData.append('pdfs', file));

    formData.append('modulos', JSON.stringify(modulos));

    try {
      const res = await fetch('http://localhost:3001/api/cursos', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Error creando curso');

      const data = await res.json();
      onCursoCreado(data);
    } catch (error) {
      alert('Error creando curso');
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
