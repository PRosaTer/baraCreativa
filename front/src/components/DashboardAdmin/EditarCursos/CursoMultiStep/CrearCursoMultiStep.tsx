'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Curso } from '@/app/types/curso';


import PasoInfoBasica from './PasoInfoBasica';
import PasoDetallesArchivos from './PasoDetallesArchivos';
import PasoGestionModulos from './PasoGestionModulos';
import { useCursoFormulario } from '../../../../app/hooks/CursoMultiStep/useCursoFormulario';
import { formStyle, buttonStyle } from './estilos';

interface Props {
  onGuardar: (curso: Curso) => Promise<void>;
  onCancelar: () => void;
}

const CrearCursoMultiStep: React.FC<Props> = ({ onGuardar, onCancelar }) => {
  const router = useRouter();

  const {
    step,
    form,
    error,
    exito,
    loading,
    handleChange,
    handleFileChange,
    handleAddModulo,
    handleRemoveModulo,
    handleModuloTitleChange,
    nextStep,
    prevStep,
    handleSubmit,
    setForm,
  } = useCursoFormulario(onGuardar, router.push);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PasoInfoBasica
            form={form}
            handleChange={handleChange}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PasoDetallesArchivos
            form={form}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <PasoGestionModulos
            form={form}
            setForm={setForm}
            handleModuloTitleChange={handleModuloTitleChange}
            handleAddModulo={handleAddModulo}
            handleRemoveModulo={handleRemoveModulo}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>

      {error && <p style={{ color: '#8b0000', fontWeight: '700', marginBottom: 20 }}>{error}</p>}
      {exito && <p style={{ color: '#065f46', fontWeight: '700', marginBottom: 20 }}>{exito}</p>}

      {renderStep()}

      <button
        type="button"
        onClick={onCancelar}
        style={{ ...buttonStyle, backgroundColor: '#6b7280', marginTop: 10 }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4b5563';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#6b7280';
        }}
      >
        Cancelar
      </button>
    </form>
  );
};

export default CrearCursoMultiStep;
