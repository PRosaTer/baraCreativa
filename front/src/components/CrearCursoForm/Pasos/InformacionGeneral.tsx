import React, { Dispatch, SetStateAction } from 'react';
import { ModuloForm } from '@/app/types/curso';


interface Props {
  titulo: string;
  setTitulo: Dispatch<SetStateAction<string>>;
  descripcion: string;
  setDescripcion: Dispatch<SetStateAction<string>>;
  precio: string;
  setPrecio: Dispatch<SetStateAction<string>>;
  duracionHoras: string;
  setDuracionHoras: Dispatch<SetStateAction<string>>;
  tipo: 'Docentes' | 'Empresas';
  setTipo: Dispatch<SetStateAction<'Docentes' | 'Empresas'>>;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  setModalidad: Dispatch<SetStateAction<'en vivo' | 'grabado' | 'mixto'>>;
  categoria: string;
  setCategoria: Dispatch<SetStateAction<string>>;
  certificadoDisponible: boolean;
  setCertificadoDisponible: Dispatch<SetStateAction<boolean>>;
  badgeDisponible: boolean;
  setBadgeDisponible: Dispatch<SetStateAction<boolean>>;
  imagenes: File[];
  setImagenes: Dispatch<SetStateAction<File[]>>;
  videos: File[];
  setVideos: Dispatch<SetStateAction<File[]>>;
  pdfs: File[];
  setPdfs: Dispatch<SetStateAction<File[]>>;
  imagenCursoExistente?: string | null;
  videoCursoExistente?: string | null;
  pdfCursoExistente?: string | null;
}

export default function InformacionGeneral({
  titulo, setTitulo, descripcion, setDescripcion, precio, setPrecio,
  duracionHoras, setDuracionHoras, tipo, setTipo, modalidad, setModalidad,
  categoria, setCategoria, certificadoDisponible, setCertificadoDisponible,
  badgeDisponible, setBadgeDisponible, imagenes, setImagenes, videos, setVideos,
  pdfs, setPdfs,
  imagenCursoExistente, videoCursoExistente, pdfCursoExistente,
}: Props) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: Dispatch<SetStateAction<File[]>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setter([e.target.files[0]]);
    } else {
      setter([]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Información General del Curso</h3>

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Título del curso"
        />
      </div>

  
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Descripción detallada del curso"
        ></textarea>
      </div>


      <div>
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          id="precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Ej: 100.00"
        />
      </div>


      <div>
        <label htmlFor="duracionHoras" className="block text-sm font-medium text-gray-700">Duración (horas)</label>
        <input
          type="number"
          id="duracionHoras"
          value={duracionHoras}
          onChange={(e) => setDuracionHoras(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Ej: 10"
        />
      </div>


      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo de Curso</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as 'Docentes' | 'Empresas')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Docentes">Docentes</option>
          <option value="Empresas">Empresas</option>
        </select>
      </div>


      <div>
        <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
        <select
          id="modalidad"
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value as 'en vivo' | 'grabado' | 'mixto')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="en vivo">En Vivo</option>
          <option value="grabado">Grabado</option>
          <option value="mixto">Mixto</option>
        </select>
      </div>


      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
        <input
          type="text"
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Ej: Programación, Marketing"
        />
      </div>


      <div className="flex items-center">
        <input
          type="checkbox"
          id="certificadoDisponible"
          checked={certificadoDisponible}
          onChange={(e) => setCertificadoDisponible(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="certificadoDisponible" className="ml-2 block text-sm text-gray-900">Certificado Disponible</label>
      </div>

      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="badgeDisponible"
          checked={badgeDisponible}
          onChange={(e) => setBadgeDisponible(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="badgeDisponible" className="ml-2 block text-sm text-gray-900">Badge Disponible</label>
      </div>


      <div>
        <label htmlFor="imagenCurso" className="block text-sm font-medium text-gray-700">Imagen del Curso</label>

        {imagenCursoExistente && imagenes.length === 0 && (
          <div className="mt-2 mb-2">
            <p className="text-sm text-gray-600">Imagen actual:</p>
            <img
              src={`http://localhost:3001${imagenCursoExistente}?t=${new Date().getTime()}`}
              alt="Imagen actual del curso"
              className="w-32 h-auto rounded-md object-cover"
              onError={(e) => {
                console.error('Error al cargar imagen existente en InformacionGeneral:', e.currentTarget.src);
                e.currentTarget.src = 'https://placehold.co/96x96/cccccc/000000?text=Error+Img';
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        )}
        <input
          type="file"
          id="imagenCurso"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setImagenes)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagenes.length > 0 && <p className="mt-1 text-sm text-gray-500">Archivo seleccionado: {imagenes[0].name}</p>}
      </div>

   
      <div>
        <label htmlFor="videoCurso" className="block text-sm font-medium text-gray-700">Video del Curso</label>
        {videoCursoExistente && videos.length === 0 && (
          <div className="mt-2 mb-2">
            <p className="text-sm text-gray-600">Video actual: <a href={`http://localhost:3001${videoCursoExistente}?t=${new Date().getTime()}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver Video</a></p>
          </div>
        )}
        <input
          type="file"
          id="videoCurso"
          accept="video/*"
          onChange={(e) => handleFileChange(e, setVideos)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {videos.length > 0 && <p className="mt-1 text-sm text-gray-500">Archivo seleccionado: {videos[0].name}</p>}
      </div>


      <div>
        <label htmlFor="pdfCurso" className="block text-sm font-medium text-gray-700">PDF del Curso</label>
        {pdfCursoExistente && pdfs.length === 0 && (
          <div className="mt-2 mb-2">
            <p className="text-sm text-gray-600">PDF actual: <a href={`http://localhost:3001${pdfCursoExistente}?t=${new Date().getTime()}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver PDF</a></p>
          </div>
        )}
        <input
          type="file"
          id="pdfCurso"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, setPdfs)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {pdfs.length > 0 && <p className="mt-1 text-sm text-gray-500">Archivo seleccionado: {pdfs[0].name}</p>}
      </div>

    </div>
  );
}
