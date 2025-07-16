import React, { ChangeEvent } from 'react';
import { CursoForm, EditableModuloForm } from '@/app/types/curso';
import { labelStyle, inputStyle, moduloItemStyle, removeModuloButtonStyle, addModuloButtonStyle, buttonStyle } from './estilos';

interface PasoGestionModulosProps {
  form: CursoForm;
  handleModuloTitleChange: (index: number, value: string) => void;
  handleAddModulo: () => void;
  handleRemoveModulo: (index: number) => void;
  setForm: React.Dispatch<React.SetStateAction<CursoForm>>;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const PasoGestionModulos: React.FC<PasoGestionModulosProps> = ({
  form,
  handleModuloTitleChange,
  handleAddModulo,
  handleRemoveModulo,
  setForm,
  onPrev,
  onSubmit,
  loading,
}) => {
  return (
    <>
      <h3 style={{ marginBottom: 15, textAlign: 'center', color: '#5a1a01' }}>Módulos del Curso</h3>
      {form.modulos.map((modulo, index) => (
        <div key={modulo.id} style={moduloItemStyle}>
          <input
            type="text"
            placeholder={`Título del Módulo ${index + 1}`}
            value={modulo.titulo}
            onChange={(e) => handleModuloTitleChange(index, e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>Video del Módulo (opcional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              setForm(prev => {
                const newModulos: EditableModuloForm[] = [...prev.modulos];
                newModulos[index] = { ...newModulos[index], videoFile: files && files.length > 0 ? files[0] : null };
                return { ...prev, modulos: newModulos };
              });
            }}
            style={{ marginBottom: 10 }}
          />

          <label style={labelStyle}>PDF del Módulo (opcional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              setForm(prev => {
                const newModulos: EditableModuloForm[] = [...prev.modulos];
                newModulos[index] = { ...newModulos[index], pdfFile: files && files.length > 0 ? files[0] : null };
                return { ...prev, modulos: newModulos };
              });
            }}
            style={{ marginBottom: 10 }}
          />

          <label style={labelStyle}>Imagen del Módulo (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              setForm(prev => {
                const newModulos: EditableModuloForm[] = [...prev.modulos];
                newModulos[index] = { ...newModulos[index], imageFile: files && files.length > 0 ? files[0] : null };
                return { ...prev, modulos: newModulos };
              });
            }}
            style={{ marginBottom: 20 }}
          />

          <button type="button" onClick={() => handleRemoveModulo(index)} style={removeModuloButtonStyle}>
            Eliminar Módulo
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddModulo} style={addModuloButtonStyle}>
        Añadir Módulo
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={onPrev} style={{ ...buttonStyle, backgroundColor: '#6b7280', width: '48%' }}>Anterior</button>
        <button
          type="submit"
          disabled={loading}
          style={{ ...buttonStyle, width: '48%' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f59e0b';
            (e.currentTarget as HTMLButtonElement).style.color = '#5a1a01';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b91c1c';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
        >
          {loading ? 'Creando Curso...' : 'Crear Curso'}
        </button>
      </div>
    </>
  );
};

export default PasoGestionModulos;
