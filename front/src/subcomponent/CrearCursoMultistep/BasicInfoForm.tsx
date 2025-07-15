import React, { ChangeEvent } from "react";
import { CursoForm, ClaseItem, TipoCurso } from "@/app/types/curso";
import {
  formStyle,
  inputStyle,
  labelStyle,
  checkboxLabelStyle,
} from "@/subcomponent/CrearCursoMultistep/styles";

interface BasicInfoFormProps {
  form: CursoForm;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  form,
  handleChange,
}) => (
  <div style={formStyle}>
    <label htmlFor="claseItem" style={labelStyle}>
      Tipo de Item
    </label>
    <select
      name="claseItem"
      id="claseItem"
      value={form.claseItem}
      onChange={handleChange}
      style={inputStyle}
      required
    >
      <option value={ClaseItem.CURSO}>Curso</option>
      <option value={ClaseItem.SERVICIO}>Servicio</option>
    </select>

    <label style={labelStyle}>Título</label>
    <input
      type="text"
      name="titulo"
      value={form.titulo}
      onChange={handleChange}
      required
      style={inputStyle}
    />

    <label style={labelStyle}>Descripción</label>
    <textarea
      name="descripcion"
      value={form.descripcion || ""}
      onChange={handleChange}
      rows={4}
      required
      style={{ ...inputStyle, resize: "vertical" }}
    />

    <label style={labelStyle}>Precio</label>
    <input
      type="number"
      name="precio"
      value={form.precio}
      onChange={handleChange}
      min={0}
      step={0.01}
      style={inputStyle}
    />

    <label style={labelStyle}>Tipo de Audiencia</label>
    <select
      name="tipo"
      value={form.tipo}
      onChange={handleChange}
      required
      style={inputStyle}
    >
      <option value={TipoCurso.DOCENTES}>Docentes</option>
      <option value={TipoCurso.ESTUDIANTES}>Estudiantes</option>
      <option value={TipoCurso.EMPRESAS}>Empresas</option>
    </select>

    <label style={labelStyle}>Categoría</label>
    <input
      type="text"
      name="categoria"
      value={form.categoria}
      onChange={handleChange}
      required
      style={inputStyle}
    />

    <label style={labelStyle}>Subcategoría</label>
    <input
      type="text"
      name="subcategoria"
      value={form.subcategoria}
      onChange={handleChange}
      required
      style={inputStyle}
    />

    <label style={checkboxLabelStyle}>
      <input
        type="checkbox"
        name="certificadoDisponible"
        checked={form.certificadoDisponible}
        onChange={handleChange}
        style={{ marginRight: 8 }}
      />
      Certificado disponible
    </label>

    <label style={checkboxLabelStyle}>
      <input
        type="checkbox"
        name="badgeDisponible"
        checked={form.badgeDisponible}
        onChange={handleChange}
        style={{ marginRight: 8 }}
      />
      Badge disponible
    </label>
  </div>
);

export default BasicInfoForm;
