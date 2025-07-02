'use client';

import React, { useState } from 'react';
import { Curso, Modulo } from '@/app/types/curso';


interface CrearCursoFormProps {
  onCursoCreado: (cursoGuardado: Curso) => void; 
  onCancelar: () => void; 
}


export default function CrearCursoForm({ onCursoCreado, onCancelar }: CrearCursoFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [duracionHoras, setDuracionHoras] = useState(0);
  const [tipo, setTipo] = useState('Docentes');
  const [categoria, setCategoria] = useState('Programación');
  const [modalidad, setModalidad] = useState('grabado');
  const [certificadoDisponible, setCertificadoDisponible] = useState(false);
  const [badgeDisponible, setBadgeDisponible] = useState(false);
  const [imagenCurso, setImagenCurso] = useState<File | null>(null);

  const [modulos, setModulos] = useState<Modulo[]>([]);
  type ModuleFilesState = {
    videos?: File;
    pdfs?: File;
    imagenes?: File;
  };
  const [moduloFiles, setModuloFiles] = useState<ModuleFilesState[]>([]);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleAddModulo = () => {
    setModulos([...modulos, { titulo: '', descripcion: '' }]);
    setModuloFiles([...moduloFiles, {}]);
  };

  const handleModuloChange = (index: number, field: 'titulo' | 'descripcion', value: string) => {
    const newModulos = [...modulos];
    newModulos[index][field] = value;
    setModulos(newModulos);
  };

  const handleModuloFileChange = (index: number, fileType: 'videos' | 'pdfs' | 'imagenes', file: File) => {
    const newModuloFiles = [...moduloFiles];
    if (!newModuloFiles[index]) {
      newModuloFiles[index] = {};
    }
    newModuloFiles[index] = { ...newModuloFiles[index], [fileType]: file };
    setModuloFiles(newModuloFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');
    setError('');

    const formData = new FormData();

    const courseData = {
      titulo,
      descripcion,
      precio,
      duracionHoras,
      tipo,
      categoria,
      modalidad,
      certificadoDisponible,
      badgeDisponible,
      modulos: modulos.map((m) => ({
        titulo: m.titulo,
        descripcion: m.descripcion,
      })),
    };
    formData.append('courseData', JSON.stringify(courseData));

    moduloFiles.forEach((filesForModule, moduleIndex) => {
      if (filesForModule.videos) {
        formData.append(`modulos[${moduleIndex}][videos]`, filesForModule.videos);
      }
      if (filesForModule.pdfs) {
        formData.append(`modulos[${moduleIndex}][pdfs]`, filesForModule.pdfs);
      }
      if (filesForModule.imagenes) {
        formData.append(`modulos[${moduleIndex}][imagenes]`, filesForModule.imagenes);
      }
    });

    try {
      const res = await fetch('http://localhost:3001/api/cursos/scorm_unzipped_courses', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al generar el paquete SCORM.');
      }

      const data = await res.json();
      setMensaje('Curso SCORM generado y creado correctamente.');
      onCursoCreado(data.curso); 
    } catch (err: unknown) {
      let errorMessage = 'Error desconocido al generar SCORM.';
      if (err instanceof Error) {
        errorMessage = `Error al generar SCORM: ${err.message}`;
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: string }).message === 'string') {
        errorMessage = `Error al generar SCORM: ${(err as { message: string }).message}`;
      } else {
        errorMessage = `Error al generar SCORM: ${String(err)}`;
      }
      setError(errorMessage);
      console.error('Error al generar SCORM:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Curso SCORM</h1>

      {mensaje && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{mensaje}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Detalles Generales del Curso</h2>
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="duracionHoras" className="block text-sm font-medium text-gray-700">Duración (horas)</label>
              <input
                type="number"
                id="duracionHoras"
                value={duracionHoras}
                onChange={(e) => setDuracionHoras(parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="Docentes">Docentes</option>
                <option value="Estudiantes">Estudiantes</option>
              </select>
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
              <input
                type="text"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
              <select
                id="modalidad"
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="grabado">Grabado</option>
                <option value="vivo">En Vivo</option>
              </select>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="certificadoDisponible"
                checked={certificadoDisponible}
                onChange={(e) => setCertificadoDisponible(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="certificadoDisponible" className="ml-2 block text-sm text-gray-900">Certificado Disponible</label>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="badgeDisponible"
                checked={badgeDisponible}
                onChange={(e) => setBadgeDisponible(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="badgeDisponible" className="ml-2 block text-sm text-gray-900">Badge Disponible</label>
            </div>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Módulos del Curso</h2>
          {modulos.map((modulo, index) => (
            <div key={index} className="border p-3 rounded-md mb-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-2">Módulo {index + 1}</h3>
              <div>
                <label htmlFor={`modulo-titulo-${index}`} className="block text-sm font-medium text-gray-700">Título del Módulo</label>
                <input
                  type="text"
                  id={`modulo-titulo-${index}`}
                  value={modulo.titulo}
                  onChange={(e) => handleModuloChange(index, 'titulo', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor={`modulo-descripcion-${index}`} className="block text-sm font-medium text-gray-700">Descripción del Módulo</label>
                <textarea
                  id={`modulo-descripcion-${index}`}
                  value={modulo.descripcion}
                  onChange={(e) => handleModuloChange(index, 'descripcion', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
              <div className="mt-3">
                <label htmlFor={`modulo-video-${index}`} className="block text-sm font-medium text-gray-700">Video (opcional)</label>
                <input
                  type="file"
                  id={`modulo-video-${index}`}
                  accept="video/*"
                  onChange={(e) => e.target.files && handleModuloFileChange(index, 'videos', e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="mt-3">
                <label htmlFor={`modulo-pdf-${index}`} className="block text-sm font-medium text-gray-700">PDF (opcional)</label>
                <input
                  type="file"
                  id={`modulo-pdf-${index}`}
                  accept=".pdf"
                  onChange={(e) => e.target.files && handleModuloFileChange(index, 'pdfs', e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="mt-3">
                <label htmlFor={`modulo-imagen-${index}`} className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
                <input
                  type="file"
                  id={`modulo-imagen-${index}`}
                  accept="image/*"
                  onChange={(e) => e.target.files && handleModuloFileChange(index, 'imagenes', e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddModulo}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Añadir Módulo
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          disabled={cargando}
        >
          {cargando ? 'Generando SCORM...' : 'Crear Curso SCORM'}
        </button>
      </form>
    </div>
  );
}
