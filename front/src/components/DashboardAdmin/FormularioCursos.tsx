import React, { useState, useEffect, FormEvent } from 'react';
import { Curso, TipoCurso, ModalidadCurso } from '@/app/types/curso';

interface Props {
  cursoInicial?: Curso;
  onSubmit: (formData: FormData) => Promise<void>;
}

const FormularioCurso: React.FC<Props> = ({ cursoInicial, onSubmit }) => {
  const [titulo, setTitulo] = useState(cursoInicial?.titulo || '');
  const [descripcion, setDescripcion] = useState(cursoInicial?.descripcion || '');
  const [tipo, setTipo] = useState<TipoCurso>(cursoInicial?.tipo || TipoCurso.Docentes);
  const [categoria, setCategoria] = useState(cursoInicial?.categoria || '');
  const [duracionHoras, setDuracionHoras] = useState(cursoInicial?.duracionHoras.toString() || '');
  const [precio, setPrecio] = useState(cursoInicial?.precio.toString() || '');
  const [modalidad, setModalidad] = useState<ModalidadCurso>(cursoInicial?.modalidad || ModalidadCurso.EnVivo);
  const [certificadoDisponible, setCertificadoDisponible] = useState(cursoInicial?.certificadoDisponible || false);
  const [badgeDisponible, setBadgeDisponible] = useState(cursoInicial?.badgeDisponible || false);
  const [imagenCurso, setImagenCurso] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cursoInicial) {
      setTitulo(cursoInicial.titulo);
      setDescripcion(cursoInicial.descripcion);
      setTipo(cursoInicial.tipo);
      setCategoria(cursoInicial.categoria);
      setDuracionHoras(cursoInicial.duracionHoras.toString());
      setPrecio(cursoInicial.precio.toString());
      setModalidad(cursoInicial.modalidad);
      setCertificadoDisponible(cursoInicial.certificadoDisponible);
      setBadgeDisponible(cursoInicial.badgeDisponible);
      setImagenCurso(null);
    } else {
      setTitulo('');
      setDescripcion('');
      setTipo(TipoCurso.Docentes);
      setCategoria('');
      setDuracionHoras('');
      setPrecio('');
      setModalidad(ModalidadCurso.EnVivo);
      setCertificadoDisponible(false);
      setBadgeDisponible(false);
      setImagenCurso(null);
    }
  }, [cursoInicial]);

  const manejarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenCurso(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !descripcion.trim()) {
      alert('Título y descripción son obligatorios');
      return;
    }
    if (!categoria.trim() || !duracionHoras || !precio) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    if (isNaN(Number(duracionHoras)) || isNaN(Number(precio))) {
      alert('Duración y precio deben ser números válidos');
      return;
    }

    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descripcion', descripcion);
      formData.append('tipo', tipo);
      formData.append('categoria', categoria);
      formData.append('duracionHoras', duracionHoras);
      formData.append('precio', precio);
      formData.append('modalidad', modalidad);
      formData.append('certificadoDisponible', certificadoDisponible ? 'true' : 'false');
      formData.append('badgeDisponible', badgeDisponible ? 'true' : 'false');
      if (imagenCurso) formData.append('imagenCurso', imagenCurso);

      await onSubmit(formData);
    } catch (error) {
      alert('Error al guardar el curso');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">{cursoInicial ? 'Editar Curso' : 'Nuevo Curso'}</h2>

      <div>
        <label className="block font-semibold mb-1">Título*</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Descripción*</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tipo de Curso*</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoCurso)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value={TipoCurso.Docentes}>Docentes</option>
          <option value={TipoCurso.Empresas}>Empresas</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Categoría*</label>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Duración (horas)*</label>
        <input
          type="number"
          value={duracionHoras}
          onChange={(e) => setDuracionHoras(e.target.value)}
          min={0}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Precio ($)*</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min={0}
          step="0.01"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Modalidad*</label>
        <select
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value as ModalidadCurso)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value={ModalidadCurso.EnVivo}>En vivo</option>
          <option value={ModalidadCurso.Grabado}>Grabado</option>
          <option value={ModalidadCurso.Mixto}>Mixto</option>
        </select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={certificadoDisponible}
            onChange={(e) => setCertificadoDisponible(e.target.checked)}
          />
          <span>Certificado disponible</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={badgeDisponible}
            onChange={(e) => setBadgeDisponible(e.target.checked)}
          />
          <span>Badge disponible</span>
        </label>
      </div>

      <div>
        <label className="block font-semibold mb-1">Imagen del curso</label>
        <input type="file" accept="image/*" onChange={manejarArchivo} />
        {cursoInicial?.imagenCurso && !imagenCurso && (
          <img
            src={`http://localhost:3001/uploads/cursos/${cursoInicial.imagenCurso}`}
            alt="Imagen curso"
            className="mt-2 w-48 rounded"
          />
        )}
        {imagenCurso && (
          <img
            src={URL.createObjectURL(imagenCurso)}
            alt="Vista previa"
            className="mt-2 w-48 rounded"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={guardando}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {guardando ? 'Guardando...' : cursoInicial ? 'Actualizar Curso' : 'Crear Curso'}
      </button>
    </form>
  );
};

export default FormularioCurso;
