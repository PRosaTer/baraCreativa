import React, { useState, ChangeEvent, FormEvent } from 'react';
import { CursoForm, Curso, ClaseItem } from '@/app/types/curso'; // Importa ClaseItem si no está ya en types/curso

interface Props {
  curso: Curso;
  onGuardar: (curso: Curso) => Promise<void>;
  onCancelar: () => void;
}

const EditarCursoAdmin: React.FC<Props> = ({ curso, onGuardar, onCancelar }) => {
  const [form, setForm] = useState<CursoForm>({
    titulo: curso.titulo || '',
    descripcion: curso.descripcion || '',
    precio: curso.precio || '',
    duracionHoras: curso.duracionHoras || '',
    tipo: curso.tipo || '',
    categoria: curso.categoria || '',
    modalidad: curso.modalidad || '',
    certificadoDisponible: curso.certificadoDisponible || false,
    badgeDisponible: curso.badgeDisponible || false,
    imagenCurso: curso.imagenCurso || null, // Ahora acepta string o null
    archivoScorm: curso.archivoScorm || null, // Ahora acepta string o null
    modulos: curso.modulos || [],
    newScormFile: null,
    claseItem: curso.claseItem || ClaseItem.CURSO, // ¡Añadido! Asegura que siempre tenga un valor
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
        name === 'precio' || name === 'duracionHoras'
          ? value === '' ? '' : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === 'newScormFile') {
      const file = files[0];
      if (file.type !== 'application/zip' && file.type !== 'application/x-zip-compressed') {
        setError('Solo archivos .zip permitidos para SCORM');
        setForm(prev => ({ ...prev, newScormFile: null })); // Limpia el archivo si es inválido
        return;
      }
      setForm(prev => ({ ...prev, newScormFile: file }));
      setError('');
    } else if (name === 'imagenCurso') {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Solo imágenes permitidas para la imagen del curso');
        setForm(prev => ({ ...prev, imagenCurso: null })); // Limpia el archivo si es inválido
        return;
      }
      setForm(prev => ({ ...prev, imagenCurso: file }));
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setLoading(true);

    try {
      const patchData = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracionHoras: Number(form.duracionHoras),
        tipo: form.tipo,
        categoria: form.categoria,
        modalidad: form.modalidad,
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        claseItem: form.claseItem, // ¡Añadido!
      };

      // PATCH para actualizar información básica del curso
      const resInfo = await fetch(`http://localhost:3001/api/cursos/${curso.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
        credentials: 'include',
      });
      if (!resInfo.ok) {
        const errData = await resInfo.json();
        throw new Error(errData.message || 'Error al actualizar información del curso');
      }

      // POST para subir imagen del curso
      // Asegúrate de que form.imagenCurso sea un File antes de intentar subirlo
      if (form.imagenCurso instanceof File) {
        const formDataImagen = new FormData();
        formDataImagen.append('imagen', form.imagenCurso);
        const resImg = await fetch(`http://localhost:3001/api/cursos/${curso.id}/imagen`, {
          method: 'POST',
          body: formDataImagen,
          credentials: 'include',
        });
        if (!resImg.ok) {
          const errData = await resImg.json();
          throw new Error(errData.message || 'Error al subir imagen del curso');
        }
      }

      // POST para subir archivo SCORM (usando newScormFile)
      if (form.newScormFile) {
        const formDataScorm = new FormData();
        formDataScorm.append('scormFile', form.newScormFile);
        formDataScorm.append('cursoId', curso.id.toString()); // Asegúrate de enviar el cursoId
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

      setExito('Curso actualizado correctamente');
      // Asegura que la llamada para obtener el curso actualizado también tenga credenciales
      const cursoActualizado = await fetch(`http://localhost:3001/api/cursos/${curso.id}`, { credentials: 'include' }).then(res => res.json());
      await onGuardar(cursoActualizado);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Editar Curso SCORM</h2>

      <label style={labelStyle}>Título</label>
      <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Descripción</label>
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />

      <label style={labelStyle}>Precio</label>
      <input type="number" name="precio" value={form.precio} onChange={handleChange} min={0} step={0.01} style={inputStyle} />

      <label style={labelStyle}>Duración (horas)</label>
      <input type="number" name="duracionHoras" value={form.duracionHoras} onChange={handleChange} min={0} step={1} style={inputStyle} />

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

      <label style={labelStyle}>Imagen del curso (archivo o URL actual)</label>
      <input type="file" name="imagenCurso" accept="image/*" onChange={handleFileChange} style={{ marginBottom: 20 }} />
      {typeof form.imagenCurso === 'string' && form.imagenCurso && (
        <img src={form.imagenCurso} alt="Imagen curso" style={{ maxWidth: '100%', maxHeight: 180, marginBottom: 20, borderRadius: 10 }} />
      )}

      <label style={labelStyle}>Archivo SCORM (.zip)</label>
      <input type="file" name="newScormFile" accept=".zip" onChange={handleFileChange} style={{ marginBottom: 20 }} />

      {error && <p style={{ color: '#8b0000', fontWeight: '700', marginBottom: 20 }}>{error}</p>}
      {exito && <p style={{ color: '#065f46', fontWeight: '700', marginBottom: 20 }}>{exito}</p>}

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f59e0b';
          (e.currentTarget as HTMLButtonElement).style.color = '#5a1a01';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b91c1c';
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
      >
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>

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

export default EditarCursoAdmin;
