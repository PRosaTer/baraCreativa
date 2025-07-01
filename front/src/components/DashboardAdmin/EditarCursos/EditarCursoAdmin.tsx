import React, { useState, useEffect, ChangeEvent } from 'react';
import { Curso, CursoForm, Modulo, EditableModuloForm, ModuloForm } from '@/app/types/curso';
import ListaModulos from './ListaModulos';

interface Props {
  curso: Curso;
  onGuardar: (cursoGuardado: Curso) => void;
  onCancelar: () => void;
}

export default function EditarCursoAdmin({ curso, onGuardar, onCancelar }: Props) {
  const [formData, setFormData] = useState<CursoForm>({
    titulo: curso.titulo || '',
    descripcion: curso.descripcion || '',
    tipo: curso.tipo || '',
    categoria: curso.categoria || '',
    duracionHoras: curso.duracionHoras || '',
    precio: typeof curso.precio === 'string' ? (parseFloat(curso.precio) || '') : curso.precio,
    modalidad: curso.modalidad || '',
    certificadoDisponible: curso.certificadoDisponible || false,
    badgeDisponible: curso.badgeDisponible || false,
    imagenCurso: null,
    modulos: curso.modulos?.map(m => ({ 
      id: m.id,
      titulo: m.titulo,
      descripcion: m.descripcion,
      videoUrl: m.videoUrl || null,
      pdfUrl: m.pdfUrl || null,
      videos: [], 
      pdfs: [],
      imagenes: [],
    })) || [],
  });


  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (curso.imagenCurso) {
      setExistingImageUrl(`http://localhost:3001/uploads/imagenes-cursos/${curso.imagenCurso}`);
    } else {
      setExistingImageUrl(null);
    }

    setFormData({
      titulo: curso.titulo || '',
      descripcion: curso.descripcion || '',
      tipo: curso.tipo || '',
      categoria: curso.categoria || '',
      duracionHoras: curso.duracionHoras || '',
      precio: typeof curso.precio === 'string' ? (parseFloat(curso.precio) || '') : curso.precio,
      modalidad: curso.modalidad || '',
      certificadoDisponible: curso.certificadoDisponible || false,
      badgeDisponible: curso.badgeDisponible || false,
      imagenCurso: null,
      modulos: curso.modulos?.map((m: Modulo) => ({
        id: m.id,
        titulo: m.titulo,
        descripcion: m.descripcion,
        videoUrl: m.videoUrl || null,
        pdfUrl: m.pdfUrl || null,
        videos: [],
        pdfs: [],
        imagenes: [],
      })) || [],
    });
  }, [curso]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imagenCurso: e.target.files![0],
      }));
      setExistingImageUrl(URL.createObjectURL(e.target.files![0]));
    }
  };

  const handleModificarModulo = (index: number, campo: keyof ModuloForm, valor: string | File[] | string | null) => {
    setFormData((prev) => {
      const nuevosModulos: EditableModuloForm[] = [...prev.modulos];
      const currentModulo = nuevosModulos[index];

      if (campo === 'videos' || campo === 'pdfs' || campo === 'imagenes') {
        if (Array.isArray(valor)) {
          currentModulo[campo] = valor;
        } else {
          console.error(`Tipo inesperado para ${campo}:`, valor);
        }
      } else if (campo === 'videoUrl' || campo === 'pdfUrl') {
        currentModulo[campo] = valor as (string | null);
      } else if (campo === 'titulo' || campo === 'descripcion') {
        currentModulo[campo] = valor as string;
      }

      return { ...prev, modulos: nuevosModulos };
    });
  };

  const handleAgregarModulo = () => {
    setFormData((prev) => ({
      ...prev,
      modulos: [...prev.modulos, { titulo: '', descripcion: '', videos: [], pdfs: [], imagenes: [], videoUrl: null, pdfUrl: null }],
    }));
  };

  const handleEliminarModulo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modulos: prev.modulos.filter((_, i) => i !== index),
    }));
  };


  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();


    const courseTextData: Partial<Curso> = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      categoria: formData.categoria,
      duracionHoras: formData.duracionHoras === '' ? 0 : Number(formData.duracionHoras),
      precio: formData.precio === '' ? 0 : Number(formData.precio),
      modalidad: formData.modalidad,
      certificadoDisponible: formData.certificadoDisponible,
      badgeDisponible: formData.badgeDisponible,
    };


    if (!curso.archivoScorm && formData.modulos) {
        courseTextData.modulos = formData.modulos.map((m: EditableModuloForm) => ({ 
            id: m.id, 
            titulo: m.titulo,
            descripcion: m.descripcion,
            videoUrl: m.videoUrl,
            pdfUrl: m.pdfUrl,
        }));
    }


    try {
      const response = await fetch(`http://localhost:3001/api/cursos/${curso.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseTextData),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el curso (datos de texto).');
      }

      let updatedCurso: Curso = await response.json();

      if (formData.imagenCurso) {
        const imageFormData = new FormData();
        imageFormData.append('imagen', formData.imagenCurso);

        const imageResponse = await fetch(`http://localhost:3001/api/cursos/${curso.id}/imagen`, {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          const errorData: { message?: string } = await imageResponse.json();
          throw new Error(errorData.message || 'Error al subir la imagen del curso.');
        }
        const imageData: { curso: Curso } = await imageResponse.json();
        updatedCurso = imageData.curso;
      }

      onGuardar(updatedCurso);
    } catch (error: unknown) {
      console.error('Error al guardar el curso:', error);
      if (error instanceof Error) {
        alert(`Error al guardar el curso: ${error.message}`);
      } else {
        alert('Error al guardar el curso: Error desconocido');
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Editar Curso: {curso.titulo}</h2>
      <form onSubmit={handleGuardar}>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Seleccione un tipo</option>
            <option value="Docentes">Docentes</option>
            <option value="Empresas">Empresas</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="duracionHoras" className="block text-sm font-medium text-gray-700">Duración (horas)</label>
          <input
            type="number"
            id="duracionHoras"
            name="duracionHoras"
            value={formData.duracionHoras}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
          <select
            id="modalidad"
            name="modalidad"
            value={formData.modalidad}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Seleccione una modalidad</option>
            <option value="en vivo">En vivo</option>
            <option value="grabado">Grabado</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="certificadoDisponible"
            name="certificadoDisponible"
            checked={formData.certificadoDisponible}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="certificadoDisponible" className="ml-2 block text-sm font-medium text-gray-700">Certificado Disponible</label>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="badgeDisponible"
            name="badgeDisponible"
            checked={formData.badgeDisponible}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="badgeDisponible" className="ml-2 block text-sm font-medium text-gray-700">Badge Disponible</label>
        </div>

 
        <div className="mb-4">
          <label htmlFor="imagenCurso" className="block text-sm font-medium text-gray-700">Imagen del Curso</label>
          {existingImageUrl && (
            <div className="mt-2 mb-4">
              <p className="text-xs text-gray-500 mb-1">Imagen actual:</p>
              <img src={existingImageUrl} alt="Imagen actual del curso" className="max-w-xs h-auto rounded-md shadow" />
            </div>
          )}
          <input
            type="file"
            id="imagenCurso"
            name="imagenCurso"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>


        {!curso.archivoScorm && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Módulos del Curso</h3>
            <ListaModulos
              modulos={formData.modulos}
              onAgregar={handleAgregarModulo}
              onModificar={handleModificarModulo}
              onEliminar={handleEliminarModulo}
            />
          </div>
        )}


        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
