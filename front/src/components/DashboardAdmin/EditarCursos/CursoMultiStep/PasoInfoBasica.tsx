import React, { ChangeEvent } from 'react';
import { CursoForm } from '@/app/types/curso';
import { labelStyle, inputStyle, buttonStyle } from './estilos';

interface PasoInfoBasicaProps {
  form: CursoForm;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onNext: () => void;
}

const PasoInfoBasica: React.FC<PasoInfoBasicaProps> = ({ form, handleChange, onNext }) => {
  return (
    <>
      <label style={labelStyle}>Título</label>
      <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Descripción</label>
      <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange} rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />

      <label style={labelStyle}>Precio</label>
      <input type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step={0.01} style={inputStyle} />

      <label style={labelStyle}>Duración (horas)</label>
      <input type="number" name="duracionHoras" value={form.duracionHoras} onChange={handleChange} min={0} step={1} style={inputStyle} />

 
      <label style={labelStyle}>Fecha de Inicio (opcional)</label>
      <input 
        type="date" 
        name="fechaInicio" 
        value={form.fechaInicio instanceof Date 
          ? form.fechaInicio.toISOString().split('T')[0] 
          : (form.fechaInicio || '')} 
        onChange={handleChange} 
        style={inputStyle} 
      />

      <button type="button" onClick={onNext} style={buttonStyle}>Siguiente</button>
    </>
  );
};

export default PasoInfoBasica;
