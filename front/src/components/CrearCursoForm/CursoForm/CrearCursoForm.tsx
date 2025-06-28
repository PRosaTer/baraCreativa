"use client";

import React from 'react';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import ImagenCurso from './ImagenCurso';
import SeccionModulos from './SeccionModulos';
import FormContainer from './FormContainer';
import TituloFormulario from './TituloFormulario';
import BotonesFormulario from './BotonesFormulario';
import useCursoForm from '@/app/hooks/CursosForm/useCursoForm';
import { Curso } from '@/app/types/curso';

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
  imagenCurso?: File | null;
  modulos: any[];
}

interface Props {
  cursoInicial?: Curso;
  onCursoCreado: (curso: Curso) => void;
  onCancelar: () => void;
}

export default function CrearCursoForm({ cursoInicial, onCursoCreado, onCancelar }: Props) {
  const {
    datos,
    guardando,
    imagenPreview,
    handleChange,
    handleFileChange,
    agregarModulo,
    handleModuloChange,
    eliminarModulo,
    handleSubmit,
  } = useCursoForm(cursoInicial, onCursoCreado);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TituloFormulario esEdicion={!!cursoInicial} />

      <InputField label="Título" name="titulo" value={datos.titulo} onChange={handleChange} />
      <TextareaField label="Descripción" name="descripcion" value={datos.descripcion} onChange={handleChange} />
      <SelectField label="Tipo" name="tipo" value={datos.tipo} options={['Docentes', 'Empresas']} onChange={handleChange} />
      <InputField label="Categoría" name="categoria" value={datos.categoria} onChange={handleChange} />

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Duración (horas)" name="duracionHoras" value={datos.duracionHoras} onChange={handleChange} type="number" min={1} />
        <InputField label="Precio" name="precio" value={datos.precio} onChange={handleChange} type="number" min={0} step={0.01} />
      </div>

      <SelectField label="Modalidad" name="modalidad" value={datos.modalidad} options={['en vivo', 'grabado', 'mixto']} onChange={handleChange} />

      <div className="flex space-x-6">
        <CheckboxField label="Certificado Disponible" name="certificadoDisponible" checked={datos.certificadoDisponible} onChange={handleChange} />
        <CheckboxField label="Badge Disponible" name="badgeDisponible" checked={datos.badgeDisponible} onChange={handleChange} />
      </div>

      <ImagenCurso handleFileChange={handleFileChange} imagenPreview={imagenPreview} />

      <SeccionModulos
        modulos={datos.modulos}
        handleModuloChange={handleModuloChange}
        eliminarModulo={eliminarModulo}
        agregarModulo={agregarModulo}
      />

      <BotonesFormulario onCancelar={onCancelar} guardando={guardando} esEdicion={!!cursoInicial} />
    </FormContainer>
  );
}
