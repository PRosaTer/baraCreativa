"use client";

import React from 'react';
import FormContainer from './FormContainer';
import ErrorMessage from './ErrorMessage';
import BotonSubmit from './BotonSubmit';
import CamposFormularioUsuario from './CamposFormularioUsuario';
import useAgregarUsuarioForm from '@/app/hooks/AgregarUsuarioAdmin/useAgregarUsuarioForm';

interface Props {
  onUsuarioCreado: () => void;
}

export default function AgregarUsuario({ onUsuarioCreado }: Props) {
  const {
    form,
    foto,
    cargando,
    error,
    setFoto,
    handleChange,
    handleSubmit,
  } = useAgregarUsuarioForm(onUsuarioCreado);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-center">Crear Usuario</h2>

      <ErrorMessage mensaje={error} />

      <CamposFormularioUsuario
        form={form}
        foto={foto}
        setFoto={setFoto}
        handleChange={handleChange}
      />

      <BotonSubmit loading={cargando} />
    </FormContainer>
  );
}
