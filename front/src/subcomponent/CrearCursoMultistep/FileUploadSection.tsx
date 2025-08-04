import React, { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CursoForm, ClaseItem } from "@/app/types/curso";
import {
  inputStyle,
  labelStyle,
} from "@/subcomponent/CrearCursoMultistep/styles";

interface FileUploadSectionProps {
  form: CursoForm;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (date: Date | null) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  form,
  handleChange,
  handleFileChange,
  handleDateChange,
}) => (
  <>

    {form.claseItem === ClaseItem.CURSO && (
      <>
        <label style={labelStyle}>Duración (horas)</label>
        <input
          type="number"
          name="duracionHoras"
          value={form.duracionHoras}
          onChange={handleChange}
          min={0}
          step={1}
          style={inputStyle}
          required
        />

        <label style={labelStyle}>Modalidad</label>
        <select
          name="modalidad"
          value={form.modalidad}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="grabado">Grabado</option>
          <option value="en vivo">En vivo</option>
          <option value="mixto">Mixto</option>
        </select>

        <label style={labelStyle}>Fecha de Inicio (opcional)</label>
        <DatePicker
          selected={form.fechaInicio instanceof Date ? form.fechaInicio : null}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="w-full"
          wrapperClassName="w-full"
          customInput={<input style={inputStyle} />}
          isClearable
          placeholderText="Seleccionar fecha"
        />
      </>
    )}

    <label style={labelStyle}>Imagen del item</label>
    <input
      type="file"
      name="imagenCurso"
      accept="image/*"
      onChange={handleFileChange}
      style={{ marginBottom: 20 }}
    />
    {typeof form.imagenCurso === "string" && form.imagenCurso && (
      <img
        src={form.imagenCurso}
        alt="Imagen item"
        style={{
          maxWidth: "100%",
          maxHeight: 180,
          marginBottom: 20,
          borderRadius: 10,
        }}
      />
    )}

    {form.claseItem === ClaseItem.CURSO && (
      <>
        <label style={labelStyle}>Archivo SCORM (.zip)</label>
        <input
          type="file"
          name="archivoScorm"
          accept=".zip"
          onChange={handleFileChange}
          style={{ marginBottom: 20 }}
        />
      </>
    )}
  </>
);

export default FileUploadSection;
