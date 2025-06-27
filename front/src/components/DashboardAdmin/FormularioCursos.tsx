import React, { useState, useEffect, FormEvent } from 'react';
import { Curso } from '@/app/types/curso';

interface Props {
  cursoInicial?: Curso;
  onSubmit: (formData: FormData) => Promise<void>;
}

const FormularioCursos: React.FC<Props> = ({ cursoInicial, onSubmit }) => {
  const [titulo, setTitulo] = useState(cursoInicial?.titulo ?? '');
  const [descripcion, setDescripcion] = useState(cursoInicial?.descripcion ?? '');
  const [categoria, setCategoria] = useState(cursoInicial?.categoria ?? '');
  const [duracionHoras, setDuracionHoras] = useState(cursoInicial?.duracionHoras.toString() ?? '');
  const [precio, setPrecio] = useState(cursoInicial?.precio.toString() ?? '');
  const [modalidad, setModalidad] = useState(cursoInicial?.modalidad ?? 'en vivo');
  const [imagenCurso, setImagenCurso] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cursoInicial) {
      setTitulo(cursoInicial.titulo);
      setDescripcion(cursoInicial.descripcion);
      setCategoria(cursoInicial.categoria);
      setDuracionHoras(cursoInicial.duracionHoras.toString());
      setPrecio(cursoInicial.precio.toString());
      setModalidad(cursoInicial.modalidad);
      setImagenCurso(null);
    } else {
      setTitulo('');
      setDescripcion('');
      setCategoria('');
      setDuracionHoras('');
      setPrecio('');
      setModalidad('en vivo');
      setImagenCurso(null);
    }
  }, [cursoInicial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('duracionHoras', duracionHoras);
    formData.append('precio', precio);
    formData.append('modalidad', modalidad);
    if (imagenCurso) formData.append('imagenCurso', imagenCurso);

    await onSubmit(formData);
    setGuardando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">{cursoInicial ? 'Editar Curso' : 'Nuevo Curso'}</h2>
      <div>
        <label>Título</label>
        <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
      </div>
 
      <button disabled={guardando}>
        {guardando ? 'Guardando...' : (cursoInicial ? 'Actualizar Curso' : 'Crear Curso')}
      </button>
    </form>
  );
};

export default FormularioCursos;
