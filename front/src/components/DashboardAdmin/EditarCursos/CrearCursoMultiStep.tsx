'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Curso, CursoForm, EditableModuloForm, ClaseItem } from '@/app/types/curso';
import { ModuloDto, TipoCurso, ModalidadCurso } from '@/app/types/shared-backend-types'; // Ensure ModuloDto is imported
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  curso?: Curso;
  onGuardar: (cursoGuardado: Curso) => Promise<void>;
  onCancelar: () => void;
}

const CrearCursoMultiStep: React.FC<Props> = ({ curso, onGuardar, onCancelar }) => {
  const [form, setForm] = useState<CursoForm>(() => {
    const initialModulos: EditableModuloForm[] = curso?.modulos
      ? curso.modulos.map((m) => ({
          id: m.id,
          titulo: m.titulo,
          descripcion: m.descripcion,
          videoUrl: m.videoUrl,
          pdfUrl: m.pdfUrl,
          imageUrl: m.imageUrl,
          videoFile: null,
          pdfFile: null,
          imageFile: null,
        }))
      : [];

    return {
      titulo: curso?.titulo || '',
      descripcion: curso?.descripcion || '',
      precio: curso?.precio || 0,
      duracionHoras: curso?.duracionHoras || 0,
      tipo: curso?.tipo || TipoCurso.DOCENTES,
      categoria: curso?.categoria || '',
      subcategoria: curso?.subcategoria || '',
      modalidad: curso?.modalidad || ModalidadCurso.GRABADO,
      certificadoDisponible: curso?.certificadoDisponible || false,
      badgeDisponible: curso?.badgeDisponible || false,
      imagenCurso: curso?.imagenCurso || null,
      archivoScorm: curso?.archivoScorm || null,
      modulos: initialModulos,
      newScormFile: null,
      claseItem: curso?.claseItem || ClaseItem.CURSO,
      fechaInicio: curso?.fechaInicio ? new Date(curso.fechaInicio) : null,
    };
  });

  const [moduloFiles, setModuloFiles] = useState<
    Array<{
      videoFile?: File | null;
      pdfFile?: File | null;
      imageFile?: File | null;
    }>
  >(
    curso?.modulos
      ? curso.modulos.map(() => ({}))
      : []
  );

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm((prev: CursoForm) => ({ ...prev, [name]: target.checked }));
      return;
    }

    if (name === 'tipo') {
      setForm((prev: CursoForm) => ({ ...prev, tipo: value as 'Docentes' | 'Estudiantes' | 'Empresas' }));
      return;
    }
    if (name === 'modalidad') {
      setForm((prev: CursoForm) => ({ ...prev, modalidad: value as 'en vivo' | 'grabado' | 'mixto' }));
      return;
    }
    if (name === 'claseItem') {
        const selectedClaseItem = value as ClaseItem;
        setForm((prev: CursoForm) => ({
            ...prev,
            claseItem: selectedClaseItem,
            duracionHoras: selectedClaseItem === ClaseItem.SERVICIO ? 0 : prev.duracionHoras,
            modalidad: selectedClaseItem === ClaseItem.SERVICIO ? ModalidadCurso.GRABADO : prev.modalidad,
            fechaInicio: selectedClaseItem === ClaseItem.SERVICIO ? null : prev.fechaInicio,
            modulos: selectedClaseItem === ClaseItem.SERVICIO ? [] : prev.modulos,
            badgeDisponible: selectedClaseItem === ClaseItem.SERVICIO ? false : prev.badgeDisponible,
        }));
        setModuloFiles(selectedClaseItem === ClaseItem.SERVICIO ? [] : moduloFiles);
        return;
    }

    setForm((prev: CursoForm) => ({
      ...prev,
      [name]: name === 'precio' || name === 'duracionHoras' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (name === 'newScormFile') {
      if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
        setError('Solo archivos .zip permitidos para SCORM');
        return;
      }
      setForm((prev: CursoForm) => ({ ...prev, newScormFile: file }));
      setError('');
    } else if (name === 'imagenCurso') {
      if (!file.type.startsWith('image/')) {
        setError('Solo imágenes permitidas para la imagen del curso');
        return;
      }
      setForm((prev: CursoForm) => ({ ...prev, imagenCurso: file }));
      setError('');
    }
  };

  const handleDateChange = (date: Date | null) => {
    setForm((prev: CursoForm) => ({
      ...prev,
      fechaInicio: date,
    }));
  };

  const handleAddModulo = () => {
    setForm((prev: CursoForm) => ({
      ...prev,
      modulos: [...prev.modulos, { titulo: '', descripcion: null, videoFile: null, pdfFile: null, imageFile: null }],
    }));
    setModuloFiles((prev: Array<{ videoFile?: File | null; pdfFile?: File | null; imageFile?: File | null; }>) => [...prev, {}]);
  };

  const handleRemoveModulo = (indexToRemove: number) => {
    setForm((prev: CursoForm) => ({
      ...prev,
      modulos: prev.modulos.filter((_, index) => index !== indexToRemove),
    }));
    setModuloFiles((prev: Array<{ videoFile?: File | null; pdfFile?: File | null; imageFile?: File | null; }>) => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleModuloChange = (index: number, field: 'titulo' | 'descripcion', value: string) => {
    setForm((prev: CursoForm) => {
      const newModulos = [...prev.modulos];
      if (field === 'descripcion') {
        newModulos[index][field] = value === '' ? null : value;
      } else {
        newModulos[index][field] = value;
      }
      return { ...prev, modulos: newModulos };
    });
  };

  const handleModuloFileChange = (
    index: number,
    fileType: 'videoFile' | 'pdfFile' | 'imageFile',
    file: File | null
  ) => {
    setModuloFiles((prev: Array<{ videoFile?: File | null; pdfFile?: File | null; imageFile?: File | null; }>) => {
      const newModuloFiles = [...prev];
      if (!newModuloFiles[index]) {
        newModuloFiles[index] = {};
      }
      newModuloFiles[index] = { ...newModuloFiles[index], [fileType]: file };
      return newModuloFiles;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setLoading(true);

    try {
      let nuevoCurso: Curso;
      const baseUrl = 'http://localhost:3001/api/cursos';

      const baseData = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        tipo: form.tipo,
        categoria: form.categoria,
        subcategoria: form.subcategoria,
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        claseItem: form.claseItem,
        fechaInicio: form.fechaInicio ? form.fechaInicio.toISOString().split('T')[0] : null,
      };

    
      type CourseDataForApi = Omit<Curso, 'id' | 'imagenCurso' | 'archivoScorm' | 'modulos' | 'fechaInicio'> & {
        modulos?: ModuloDto[];
        fechaInicio?: string | null;
      };

      let courseDataForApi: CourseDataForApi;

      if (form.claseItem === ClaseItem.CURSO) {
        courseDataForApi = {
          ...baseData,
          duracionHoras: Number(form.duracionHoras),
          modalidad: form.modalidad,
          modulos: form.modulos.map((m: EditableModuloForm): ModuloDto => ({ 
            ...(m.id !== undefined && { id: m.id }),
            titulo: m.titulo,
            descripcion: m.descripcion,
            videoUrl: m.videoUrl,
            pdfUrl: m.pdfUrl,
            imageUrl: m.imageUrl,
          })),
        };
      } else { 
        courseDataForApi = {
          ...baseData,
          duracionHoras: 0,
          modalidad: ModalidadCurso.GRABADO,
          modulos: [],
        };
      }

      if (curso) {
        const resUpdate = await fetch(`${baseUrl}/${curso.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseDataForApi),
        });
        if (!resUpdate.ok) {
          const errData = await resUpdate.json();
          throw new Error(errData.message || 'Error al actualizar ítem');
        }
        nuevoCurso = await resUpdate.json();
      } else {
        const resCreate = await fetch(baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseDataForApi),
        });
        if (!resCreate.ok) {
          const errData = await resCreate.json();
          throw new Error(errData.message || 'Error al crear ítem');
        }
        nuevoCurso = await resCreate.json();
      }

      if (form.newScormFile) {
        const formDataScorm = new FormData();
        formDataScorm.append('scormFile', form.newScormFile);
        formDataScorm.append('cursoId', nuevoCurso.id.toString());

        const resScorm = await fetch(`${baseUrl}/scorm_unzipped_courses`, {
          method: 'POST',
          body: formDataScorm,
        });

        if (!resScorm.ok) {
          const errData = await resScorm.json();
          throw new Error(errData.message || 'Error al subir archivo SCORM');
        }
      }

      if (form.imagenCurso instanceof File) {
        const formDataImagen = new FormData();
        formDataImagen.append('imagen', form.imagenCurso);
        const resImg = await fetch(`${baseUrl}/${nuevoCurso.id}/imagen`, {
          method: 'POST',
          body: formDataImagen,
        });
        if (!resImg.ok) {
          const errData = await resImg.json();
          throw new Error(errData.message || 'Error al subir imagen del ítem');
        }
      }

      if (form.claseItem === ClaseItem.CURSO) {
          await Promise.all(
              moduloFiles.map(async (filesForModule, moduleIndex) => {
                  const currentModulo = nuevoCurso.modulos[moduleIndex];
                  if (!currentModulo || !currentModulo.id) {
                      console.warn(`Módulo en el índice ${moduleIndex} no encontrado o sin ID después de la creación/actualización.`);
                      return;
                  }

                  const moduleFormData = new FormData();
                  let fileUploaded = false;

                  if (filesForModule.videoFile) {
                      moduleFormData.append('videoFile', filesForModule.videoFile);
                      fileUploaded = true;
                  }
                  if (filesForModule.pdfFile) {
                      moduleFormData.append('pdfFile', filesForModule.pdfFile);
                      fileUploaded = true;
                  }
                  if (filesForModule.imageFile) {
                      moduleFormData.append('imageFile', filesForModule.imageFile);
                      fileUploaded = true;
                  }

                  if (fileUploaded) {
                      const resModuleFiles = await fetch(`${baseUrl}/modulos/${currentModulo.id}/files`, {
                          method: 'POST',
                          body: moduleFormData,
                      });
                      if (!resModuleFiles.ok) {
                          const errData = await resModuleFiles.json();
                          console.error(`Error al subir archivos para el módulo ${currentModulo.id}:`, errData.message || 'Error desconocido');
                      }
                  }
              })
          );
      }


      setExito(`Item (${form.claseItem === ClaseItem.CURSO ? 'Curso' : 'Servicio'}) guardado correctamente`);
      await onGuardar(nuevoCurso);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const formStyle: React.CSSProperties = {
    maxWidth: 700,
    margin: '2rem auto',
    padding: 24,
    borderRadius: 15,
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#065f46',
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

  const removeModuloButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'flex-end',
    boxShadow: '0 3px 10px rgba(220, 53, 69, 0.3)',
    transition: 'background-color 0.3s ease',
  };


  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
        {curso ? 'Editar Item' : 'Crear Nuevo Item'}
      </h2>

      {error && <p style={{ color: '#8b0000', fontWeight: '700', marginBottom: 20 }}>{error}</p>}
      {exito && <p style={{ color: '#065f46', fontWeight: '700', marginBottom: 20 }}>{exito}</p>}

      <div>
        <label htmlFor="claseItem" style={labelStyle}>Tipo de Item</label>
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
      </div>

      <label style={labelStyle}>Título</label>
      <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Descripción</label>
      <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange} rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />

      <label style={labelStyle}>Precio</label>
      <input type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step={0.01} style={inputStyle} />

      {form.claseItem === ClaseItem.CURSO && (
        <>
          <label style={labelStyle}>Duración (horas)</label>
          <input type="number" name="duracionHoras" value={form.duracionHoras} onChange={handleChange} min={0} step={1} style={inputStyle} required />

          <label style={labelStyle}>Modalidad</label>
          <select name="modalidad" value={form.modalidad} onChange={handleChange} required style={inputStyle}>
            <option value={ModalidadCurso.GRABADO}>Grabado</option>
            <option value={ModalidadCurso.EN_VIVO}>En vivo</option>
            <option value={ModalidadCurso.MIXTO}>Mixto</option>
          </select>

          <label style={labelStyle}>Fecha de Inicio (opcional)</label>
          <DatePicker
            selected={form.fechaInicio}
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

      <label style={labelStyle}>Tipo de Audiencia</label>
      <select name="tipo" value={form.tipo} onChange={handleChange} required style={inputStyle}>
        <option value={TipoCurso.DOCENTES}>Docentes</option>
        <option value={TipoCurso.ESTUDIANTES}>Estudiantes</option>
        <option value={TipoCurso.EMPRESAS}>Empresas</option>
      </select>

      <label style={labelStyle}>Categoría</label>
      <input type="text" name="categoria" value={form.categoria} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Subcategoría</label>
      <input type="text" name="subcategoria" value={form.subcategoria} onChange={handleChange} required style={inputStyle} />

      <label style={checkboxLabelStyle}>
        <input type="checkbox" name="certificadoDisponible" checked={form.certificadoDisponible} onChange={handleChange} style={{ marginRight: 8 }} />
        Certificado disponible
      </label>

      <label style={checkboxLabelStyle}>
        <input type="checkbox" name="badgeDisponible" checked={form.badgeDisponible} onChange={handleChange} style={{ marginRight: 8 }} />
        Badge disponible
      </label>

      <label style={labelStyle}>Imagen del item</label>
      <input type="file" name="imagenCurso" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 20 }} />
      {typeof form.imagenCurso === 'string' && form.imagenCurso && (
        <img src={form.imagenCurso} alt="Imagen item" style={{ maxWidth: '100%', maxHeight: 180, marginBottom: 20, borderRadius: 10 }} />
      )}

      {form.claseItem === ClaseItem.CURSO && (
        <>
          <label style={labelStyle}>Archivo SCORM (.zip)</label>
          <input type="file" name="newScormFile" accept=".zip" onChange={handleFileChange} style={{ marginBottom: 20 }} />
        </>
      )}

      {form.claseItem === ClaseItem.CURSO && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px', marginBottom: '20px', background: '#f9f9f9', color: '#333' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Módulos</h3>
          {form.modulos.map((modulo: EditableModuloForm, index: number) => (
            <div key={index} style={{ border: '1px dashed #bbb', padding: '10px', marginBottom: '10px', borderRadius: '8px', background: '#e0ffe0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>Módulo {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveModulo(index)}
                  style={removeModuloButtonStyle}
                >
                  Eliminar Módulo
                </button>
              </div>
              <label style={labelStyle}>Título del Módulo</label>
              <input
                type="text"
                value={modulo.titulo}
                onChange={(e) => handleModuloChange(index, 'titulo', e.target.value)}
                style={inputStyle}
                required
              />
              <label style={labelStyle}>Descripción del Módulo</label>
              <textarea
                value={modulo.descripcion || ''} 
                onChange={(e) => handleModuloChange(index, 'descripcion', e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
                required
              />
              <label style={labelStyle}>Video (opcional)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleModuloFileChange(index, 'videoFile', e.target.files ? e.target.files[0] : null)}
                style={{ marginBottom: 10 }}
              />
              {modulo.videoUrl && (
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '10px' }}>
                  Video actual: <a href={modulo.videoUrl} target="_blank" rel="noopener noreferrer">Ver video</a>
                </p>
              )}
              <label style={labelStyle}>PDF (opcional)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleModuloFileChange(index, 'pdfFile', e.target.files ? e.target.files[0] : null)}
                style={{ marginBottom: 10 }}
              />
              {modulo.pdfUrl && (
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '10px' }}>
                  PDF actual: <a href={modulo.pdfUrl} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                </p>
              )}
              <label style={labelStyle}>Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleModuloFileChange(index, 'imageFile', e.target.files ? e.target.files[0] : null)}
                style={{ marginBottom: 10 }}
              />
              {modulo.imageUrl && (
                <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '10px' }}>
                  Imagen actual: <a href={modulo.imageUrl} target="_blank" rel="noopener noreferrer">Ver imagen</a>
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddModulo}
            style={{ ...buttonStyle, backgroundColor: '#28a745', boxShadow: '0 5px 15px rgba(40, 167, 69, 0.5)' }}
          >
            Añadir Módulo
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={loading} style={{ ...buttonStyle, flex: 1, backgroundColor: '#007bff', boxShadow: '0 5px 15px rgba(0, 123, 255, 0.5)' }}>
          {loading ? (curso ? 'Guardando...' : 'Creando...') :
            form.claseItem === ClaseItem.CURSO ? 'Crear Curso' : 'Crear Servicio'}
        </button>
        <button type="button" onClick={onCancelar} style={{ ...buttonStyle, flex: 1, backgroundColor: '#6c757d', boxShadow: '0 5px 15px rgba(108, 117, 125, 0.5)' }} disabled={loading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CrearCursoMultiStep;