'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { CursoForm, Curso, Modulo, ClaseItem, EditableModuloForm } from '@/app/types/curso';
import { useRouter } from 'next/navigation';

interface Props {
  onGuardar: (curso: Curso) => Promise<void>;
  onCancelar: () => void;
}

const CrearCursoMultiStep: React.FC<Props> = ({ onGuardar, onCancelar }) => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CursoForm>({
    titulo: '',
    descripcion: '',
    precio: '',
    duracionHoras: '',
    tipo: '',
    categoria: '',
    modalidad: '',
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    archivoScorm: null,
    modulos: [],
    newScormFile: null,
    claseItem: '',
    fechaInicio: null,
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm(prev => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [name]:
        (name === 'precio' || name === 'duracionHoras')
          ? (value === '' ? '' : Number(value))
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (name === 'imagenCurso') {
      if (!file.type.startsWith('image/')) {
        setError('Solo imágenes permitidas para la imagen del curso');
        setForm(prev => ({ ...prev, imagenCurso: null }));
        return;
      }
      setForm(prev => ({ ...prev, imagenCurso: file }));
      setError('');
    } else if (name === 'archivoScorm') {
      if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
        setError('Solo archivos .zip permitidos para SCORM');
        setForm(prev => ({ ...prev, archivoScorm: null }));
        return;
      }
      setForm(prev => ({ ...prev, archivoScorm: file }));
      setError('');
    }
  };

  const handleAddModulo = () => {
    setForm(prev => ({
      ...prev,
      modulos: [...prev.modulos, { id: Date.now(), titulo: `Módulo ${prev.modulos.length + 1}`, descripcion: null, videoUrl: null, pdfUrl: null, imageUrl: null, videoFile: null, pdfFile: null, imageFile: null }],
    }));
  };

  const handleRemoveModulo = (index: number) => {
    setForm(prev => ({
      ...prev,
      modulos: prev.modulos.filter((_, i) => i !== index),
    }));
  };

  const handleModuloTitleChange = (index: number, value: string) => {
    setForm(prev => {
      const newModulos: EditableModuloForm[] = [...prev.modulos];
      newModulos[index] = { ...newModulos[index], titulo: value };
      return { ...prev, modulos: newModulos };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setLoading(true);


    if (form.claseItem === '') {
      setError('Por favor, selecciona una Clase de Ítem.');
      setLoading(false);
      return;
    }
    if (form.tipo === '') {
      setError('Por favor, selecciona un Tipo de Curso.');
      setLoading(false);
      return;
    }
    if (form.modalidad === '') {
      setError('Por favor, selecciona una Modalidad.');
      setLoading(false);
      return;
    }


    try {
      const cursoDataToCreate = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracionHoras: Number(form.duracionHoras),
        tipo: form.tipo,
        categoria: form.categoria,
        modalidad: form.modalidad, 
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        claseItem: form.claseItem,
        fechaInicio: form.fechaInicio,
        modulos: form.modulos.map(m => ({ titulo: m.titulo, descripcion: m.descripcion || null })),
      };

      const resCurso = await fetch('http://localhost:3001/api/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(cursoDataToCreate),
        credentials: 'include',
      });

      if (!resCurso.ok) {
        const errData = await resCurso.json();
        throw new Error(errData.message || 'Error al crear el curso');
      }
      const newCurso: Curso = await resCurso.json();
      const cursoId = newCurso.id;

 
      if (form.imagenCurso instanceof File) {
        const formDataImagen = new FormData();
        formDataImagen.append('imagen', form.imagenCurso);
        const resImg = await fetch(`http://localhost:3001/api/cursos/${cursoId}/imagen`, {
          method: 'POST',
          body: formDataImagen,
          credentials: 'include',
        });
        if (!resImg.ok) {
          const errData = await resImg.json();
          throw new Error(errData.message || 'Error al subir imagen del curso');
        }
      }

  
      if (form.archivoScorm instanceof File) {
        const formDataScorm = new FormData();
        formDataScorm.append('scormFile', form.archivoScorm);
        formDataScorm.append('cursoId', cursoId.toString());
        const resScorm = await fetch(`http://localhost:3001/api/cursos/scorm_unzipped_courses`, {
          method: 'POST',
          body: formDataScorm,
          credentials: 'include',
        });
        if (!resScorm.ok) {
          const errData = await resScorm.json();
          throw new Error(errData.message || 'Error al subir archivo SCORM');
        }
      }

  
      const updatedCursoWithModulos = await fetch(`http://localhost:3001/api/cursos/${cursoId}`, { credentials: 'include' }).then(res => res.json());

      for (let i = 0; i < updatedCursoWithModulos.modulos.length; i++) {
        const moduloBackend = updatedCursoWithModulos.modulos[i];
        const moduloForm = form.modulos[i];

        const moduloId = moduloBackend.id;
        const formDataModuleFiles = new FormData();
        let filesAttached = false;

        if (moduloForm.videoFile) {
          formDataModuleFiles.append('files', moduloForm.videoFile);
          filesAttached = true;
        }
        if (moduloForm.pdfFile) {
          formDataModuleFiles.append('files', moduloForm.pdfFile);
          filesAttached = true;
        }
        if (moduloForm.imageFile) {
          formDataModuleFiles.append('files', moduloForm.imageFile);
          filesAttached = true;
        }

        if (filesAttached) {
          const resModuleFiles = await fetch(`http://localhost:3001/api/cursos/modulos/${moduloId}/files`, {
            method: 'POST',
            body: formDataModuleFiles,
            credentials: 'include',
          });

          if (!resModuleFiles.ok) {
            const errData = await resModuleFiles.json();
            console.error(`Error al subir archivos para el módulo ${moduloId}:`, errData.message || 'Error desconocido');
          }
        }
      }

      setExito('Curso creado y archivos subidos correctamente');
      await onGuardar(newCurso);
      router.push('/perfil');
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label style={labelStyle}>Título</label>
            <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />

            <label style={labelStyle}>Precio</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step={0.01} style={inputStyle} />

            <label style={labelStyle}>Duración (horas)</label>
            <input type="number" name="duracionHoras" value={form.duracionHoras} onChange={handleChange} min={0} step={1} style={inputStyle} />

            <button type="button" onClick={nextStep} style={buttonStyle}>Siguiente</button>
          </>
        );
      case 2:
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
              <option value="Docentes">Docentes</option>
              <option value="Estudiantes">Estudiantes</option>
              <option value="Empresas">Empresas</option>
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
              <button type="button" onClick={prevStep} style={{ ...buttonStyle, backgroundColor: '#6b7280', width: '48%' }}>Anterior</button>
              <button type="button" onClick={nextStep} style={{ ...buttonStyle, width: '48%' }}>Siguiente</button>
            </div>
          </>
        );
      case 3:
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
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], videoFile: files[0] };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    } else {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], videoFile: null };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    }
                  }}
                  style={{ marginBottom: 10 }}
                />

                <label style={labelStyle}>PDF del Módulo (opcional)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], pdfFile: files[0] };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    } else {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], pdfFile: null };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    }
                  }}
                  style={{ marginBottom: 10 }}
                />

                <label style={labelStyle}>Imagen del Módulo (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], imageFile: files[0] };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    } else {
                      const newModulos = [...form.modulos];
                      newModulos[index] = { ...newModulos[index], imageFile: null };
                      setForm(prev => ({ ...prev, modulos: newModulos }));
                    }
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
              <button type="button" onClick={prevStep} style={{ ...buttonStyle, backgroundColor: '#6b7280', width: '48%' }}>Anterior</button>
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
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Crear Nuevo Curso</h2>

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

const formStyle: React.CSSProperties = {
  maxWidth: 700,
  margin: '2rem auto',
  padding: 24,
  borderRadius: 15,
  background: 'linear-gradient(135deg, #ff6a00, #fddb92)',
  boxShadow: '0 10px 25px rgba(255, 105, 0, 0.3)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#5a1a01',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: 8,
  border: 'none',
  marginBottom: 16,
  fontSize: 16,
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  display: 'block',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: 10,
  border: 'none',
  backgroundColor: '#b91c1c',
  color: 'white',
  fontWeight: 700,
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(185, 28, 28, 0.5)',
  transition: 'background-color 0.3s ease',
};

const moduloItemStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.7)',
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

const removeModuloButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc2626',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  marginTop: 10,
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'background-color 0.3s ease',
};

const addModuloButtonStyle: React.CSSProperties = {
  backgroundColor: '#10b981',
  color: 'white',
  padding: '0.8rem 1.5rem',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  marginTop: 20,
  fontSize: '1rem',
  fontWeight: 700,
  transition: 'background-color 0.3s ease',
};

export default CrearCursoMultiStep;
