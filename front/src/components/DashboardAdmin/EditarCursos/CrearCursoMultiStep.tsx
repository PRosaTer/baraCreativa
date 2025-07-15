"use client";

import React from "react";
import { Curso, ClaseItem } from "@/app/types/curso";
import { useCursoForm } from "@/subcomponent/CrearCursoMultistep/useCursoForm";
import BasicInfoForm from "@/subcomponent/CrearCursoMultistep/BasicInfoForm";
import ModuloForm from "@/subcomponent/CrearCursoMultistep/ModuloForm";
import FileUploadSection from "@/subcomponent/CrearCursoMultistep/FileUploadSection";
import {
  formStyle,
  submitButtonStyle,
  cancelButtonStyle,
} from "@/subcomponent/CrearCursoMultistep/styles";

interface Props {
  curso?: Curso;
  onGuardar: (cursoGuardado: Curso) => Promise<void>;
  onCancelar: () => void;
}

const CrearCursoMultiStep: React.FC<Props> = ({
  curso,
  onGuardar,
  onCancelar,
}) => {
  const {
    form,
    moduloFiles,
    error,
    exito,
    loading,
    handleChange,
    handleFileChange,
    handleDateChange,
    handleAddModulo,
    handleRemoveModulo,
    handleModuloChange,
    handleModuloFileChange,
    handleSubmit,
  } = useCursoForm({ curso, onGuardar });

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        {curso ? "Editar Item" : "Crear Nuevo Item"}
      </h2>

      {error && (
        <p style={{ color: "#8b0000", fontWeight: "700", marginBottom: 20 }}>
          {error}
        </p>
      )}
      {exito && (
        <p style={{ color: "#065f46", fontWeight: "700", marginBottom: 20 }}>
          {exito}
        </p>
      )}

      <BasicInfoForm form={form} handleChange={handleChange} />
      <FileUploadSection
        form={form}
        handleFileChange={handleFileChange}
        handleDateChange={handleDateChange}
      />
      <ModuloForm
        form={form}
        moduloFiles={moduloFiles}
        handleModuloChange={handleModuloChange}
        handleModuloFileChange={handleModuloFileChange}
        handleAddModulo={handleAddModulo}
        handleRemoveModulo={handleRemoveModulo}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="submit"
          disabled={loading}
          style={{ ...submitButtonStyle, flex: 1 }}
        >
          {loading
            ? curso
              ? "Guardando..."
              : "Creando..."
            : form.claseItem === ClaseItem.CURSO
            ? "Crear Curso"
            : "Crear Servicio"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          style={{ ...cancelButtonStyle, flex: 1 }}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CrearCursoMultiStep;
