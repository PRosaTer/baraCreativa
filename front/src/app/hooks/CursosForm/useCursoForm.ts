"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Curso, Modulo } from '@/app/types/curso';
import { CursoForm } from '@/components/CrearCursoForm/CursoForm/CrearCursoForm';

export default function useCursoForm(cursoInicial?: Curso, onCursoCreado?: (curso: Curso) => void) {
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
    imagenCurso: null,
    modulos: [],
  });

  const [guardando, setGuardando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  useEffect(() => {
    if (cursoInicial) {
      setDatos({
        titulo: cursoInicial.titulo,
        descripcion: cursoInicial.descripcion,
        tipo: cursoInicial.tipo,
        categoria: cursoInicial.categoria,
        duracionHoras: cursoInicial.duracionHoras,
        precio: Number(cursoInicial.precio),
        modalidad: cursoInicial.modalidad,
        certificadoDisponible: cursoInicial.certificadoDisponible,
        badgeDisponible: cursoInicial.badgeDisponible,
        imagenCurso: null,
        modulos: cursoInicial.modulos || [],
      });
      if (cursoInicial.imagenCurso) {
        setImagenPreview(`http://localhost:3001/uploads/imagenes-cursos/${cursoInicial.imagenCurso}`);
      }
    }
  }, [cursoInicial]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setDatos((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setDatos((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setDatos((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDatos((prev) => ({ ...prev, imagenCurso: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarModulo = () => {
    setDatos((prev) => ({
      ...prev,
      modulos: [...prev.modulos, { id: 0, titulo: '', descripcion: '' }],
    }));
  };

  const handleModuloChange = (index: number, field: 'titulo' | 'descripcion', value: string) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos[index] = { ...nuevosModulos[index], [field]: value };
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
  };

  const eliminarModulo = (index: number) => {
    const nuevosModulos = [...datos.modulos];
    nuevosModulos.splice(index, 1);
    setDatos((prev) => ({ ...prev, modulos: nuevosModulos }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const cursoData = {
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        categoria: datos.categoria,
        duracionHoras: datos.duracionHoras,
        precio: datos.precio,
        modalidad: datos.modalidad,
        certificadoDisponible: datos.certificadoDisponible,
        badgeDisponible: datos.badgeDisponible,
        modulos: datos.modulos.map(({ id, titulo, descripcion }) => ({ titulo, descripcion })),
      };

      let res;
      if (cursoInicial && cursoInicial.id) {
        res = await fetch(`http://localhost:3001/api/cursos/${cursoInicial.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cursoData),
        });
      } else {
        res = await fetch('http://localhost:3001/api/cursos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cursoData),
        });
      }

      if (!res.ok) throw new Error('Error guardando curso');

      const cursoGuardado: Curso = await res.json();

      if (datos.imagenCurso) {
        const formData = new FormData();
        formData.append('imagen', datos.imagenCurso);

        const resImg = await fetch(`http://localhost:3001/api/cursos/${cursoGuardado.id}/imagen`, {
          method: 'POST',
          body: formData,
        });

        if (!resImg.ok) throw new Error('Error subiendo imagen');

        const jsonImg = await resImg.json();
        onCursoCreado && onCursoCreado(jsonImg.curso);
        return;
      }

      onCursoCreado && onCursoCreado(cursoGuardado);
    } catch (error) {
      console.error(error);
      alert('Error guardando el curso');
    } finally {
      setGuardando(false);
    }
  };

  return {
    datos,
    guardando,
    imagenPreview,
    handleChange,
    handleFileChange,
    agregarModulo,
    handleModuloChange,
    eliminarModulo,
    handleSubmit,
  };
}
