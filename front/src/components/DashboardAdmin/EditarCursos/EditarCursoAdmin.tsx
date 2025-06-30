'use client';

import React, { useState } from 'react';
import { Curso, Modulo } from '@/app/types/curso';
import FormularioBasico from './FormularioBasico';
import SelectorImagen from './SelectorImagen';
import ListaModulos from './ListaModulos';
import BotonesGuardado from './BotonesGuardado';

interface Props {
  curso: Curso;
  onGuardar: (cursoActualizado: Curso) => Promise<void>;
  onCancelar: () => void;
}

export default function EditarCursoAdmin({ curso, onGuardar, onCancelar }: Props) {

  const [titulo, setTitulo] = useState(curso.titulo);
  const [descripcion, setDescripcion] = useState(curso.descripcion || '');
  const [precio, setPrecio] = useState<number | string>(curso.precio);
  const [tipo, setTipo] = useState<Curso['tipo']>(curso.tipo);
  const [categoria, setCategoria] = useState(curso.categoria || '');
  const [duracionHoras, setDuracionHoras] = useState<number | string>(curso.duracionHoras || 0);
  const [modalidad, setModalidad] = useState<Curso['modalidad']>(curso.modalidad);
  const [certificadoDisponible, setCertificadoDisponible] = useState(curso.certificadoDisponible || false);
  const [badgeDisponible, setBadgeDisponible] = useState(curso.badgeDisponible || false);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>(curso.modulos || []);
  const [cargando, setCargando] = useState(false);


  const handleAgregarModulo = () => {
    setModulos([...modulos, { id: Date.now(), titulo: '', descripcion: '', videoUrl: '', pdfUrl: '' }]);
  };

  const handleModificarModulo = (index: number, campo: keyof Modulo, valor: string) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[index] = { ...nuevosModulos[index], [campo]: valor };
    setModulos(nuevosModulos);
  };

  const handleEliminarModulo = (index: number) => {
    setModulos(modulos.filter((_, i) => i !== index));
  };


  const handleImagenChange = (file: File | null) => {
    setImagenArchivo(file);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    let nombreImagen = curso.imagenCurso;

    if (imagenArchivo) {
      const formData = new FormData();
      formData.append('imagen', imagenArchivo);

      const res = await fetch(`http://localhost:3001/api/cursos/${curso.id}/imagen`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('Error al subir la imagen');
        setCargando(false);
        return;
      }

      const data = await res.json();
      nombreImagen = data.curso.imagenCurso;
    }

    const cursoActualizado: Curso = {
      ...curso,
      titulo,
      descripcion,
      precio: Number(precio),
      tipo,
      categoria,
      duracionHoras: Number(duracionHoras),
      modalidad,
      certificadoDisponible,
      badgeDisponible,
      imagenCurso: nombreImagen,
      modulos,
    };

    await onGuardar(cursoActualizado);
    setCargando(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center text-[var(--primary)]">Editar Curso</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormularioBasico
          titulo={titulo}
          setTitulo={setTitulo}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          precio={precio}
          setPrecio={setPrecio}
          tipo={tipo}
          setTipo={setTipo}
          categoria={categoria}
          setCategoria={setCategoria}
          duracionHoras={duracionHoras}
          setDuracionHoras={setDuracionHoras}
          modalidad={modalidad}
          setModalidad={setModalidad}
          certificadoDisponible={certificadoDisponible}
          setCertificadoDisponible={setCertificadoDisponible}
          badgeDisponible={badgeDisponible}
          setBadgeDisponible={setBadgeDisponible}
        />

        <SelectorImagen
          imagenCurso={curso.imagenCurso}
          imagenArchivo={imagenArchivo}
          onImagenChange={handleImagenChange}
        />

        <ListaModulos
          modulos={modulos}
          onAgregar={handleAgregarModulo}
          onModificar={handleModificarModulo}
          onEliminar={handleEliminarModulo}
        />

        <BotonesGuardado cargando={cargando} onCancelar={onCancelar} />
      </form>
    </div>
  );
}
