import React, { ChangeEvent } from 'react';
import { CursoForm, ClaseItem, TipoCurso } from '@/app/types/curso';
import { labelStyle, inputStyle, checkboxLabelStyle, buttonStyle } from './estilos';

interface PasoDetallesArchivosProps {
  form: CursoForm;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PasoDetallesArchivos: React.FC<PasoDetallesArchivosProps> = ({
  form,
  handleChange,
  handleFileChange,
  onNext,
  onPrev,
}) => {
  return (
    <>
      <label style={labelStyle}>Clase de Ítem</label>
      <select name="claseItem" value={form.claseItem} onChange={handleChange} required style={inputStyle}>
        <option value="">Seleccione...</option>
        <option value={ClaseItem.CURSO}>Curso</option>
        <option value={ClaseItem.SERVICIO}>Servicio</option>
      </select>

      <label style={labelStyle}>Tipo</label>
      <select name="tipo" value={form.tipo} onChange={handleChange} required style={inputStyle}>
        <option value="">Seleccione tipo</option>
        {/* Usar TipoCurso enum para consistencia */}
        <option value={TipoCurso.DOCENTES}>Docentes</option>
        <option value={TipoCurso.ESTUDIANTES}>Estudiantes</option>
        <option value={TipoCurso.EMPRESAS}>Empresas</option>
      </select>

      <label style={labelStyle}>Categoría</label>
      <input type="text" name="categoria" value={form.categoria} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Modalidad</label>
      <select name="modalidad" value={form.modalidad} onChange={handleChange} required style={inputStyle}>
        <option value="">Seleccione modalidad</option>
        <option value="en vivo">En vivo</option>
        <option value="grabado">Grabado</option>
        <option value="mixto">Mixto</option>
      </select>

      <label style={checkboxLabelStyle}>
        <input type="checkbox" name="certificadoDisponible" checked={form.certificadoDisponible} onChange={handleChange} style={{ marginRight: 8 }} />
        Certificado disponible
      </label>

      <label style={checkboxLabelStyle}>
        <input type="checkbox" name="badgeDisponible" checked={form.badgeDisponible} onChange={handleChange} style={{ marginRight: 8 }} />
        Badge disponible
      </label>

      <label style={labelStyle}>Imagen del curso</label>
      <input type="file" name="imagenCurso" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 20 }} />

      <label style={labelStyle}>Archivo SCORM (.zip)</label>
      <input type="file" name="archivoScorm" accept=".zip" onChange={handleFileChange} style={{ marginBottom: 20 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={onPrev} style={{ ...buttonStyle, backgroundColor: '#6b7280', width: '48%' }}>Anterior</button>
        <button type="button" onClick={onNext} style={{ ...buttonStyle, width: '48%' }}>Siguiente</button>
      </div>
    </>
  );
};

export default PasoDetallesArchivos;
