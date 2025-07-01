'use client';

import React, { useState, useEffect } from 'react';
import TablaCursosAdmin from './TablaCursosAdmin';
import CrearCursoMultiStep from '../DashboardAdmin/EditarCursos/CrearCursoMultiStep';
import EditarCursoAdmin from '../DashboardAdmin/EditarCursos/EditarCursoAdmin';
import ScormUploader from '../DashboardAdmin/EditarCursos/ScormUploader';
import { Curso } from '@/app/types/curso'; 
import InlineToast from '@/components/DashboardUsuario/InlineToast';

export default function VistaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormularioCreacion, setMostrarFormularioCreacion] = useState<boolean>(false);
  const [mostrarCargaScorm, setMostrarCargaScorm] = useState<boolean>(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string>("");


  const fetchCursos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/cursos');
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error al cargar cursos');
      }
      const data: Curso[] = await res.json();
      setCursos(data);
    } catch (error: unknown) { 
      console.error('Error cargando cursos:', error);
      if (error instanceof Error) {
        setMensajeExito(`Error cargando cursos: ${error.message}`);
      } else {
        setMensajeExito(`Error cargando cursos: Error desconocido`);
      }
    }
  };


  useEffect(() => {
    fetchCursos();
  }, []);


  const fetchCursoById = async (id: number): Promise<Curso | null> => {
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`);
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error obteniendo curso');
      }
      const data: Curso = await res.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo curso actualizado:', error);
      return null;
    }
  };


  const handleCursoGuardado = async (cursoGuardado: Curso) => {
    console.log('Curso recibido en handleCursoGuardado:', cursoGuardado);

    const cursoActualizado = await fetchCursoById(cursoGuardado.id);

    if (cursoActualizado) {
      if (!cursoEditando) { 
        setCursos((prev) => [...prev, cursoActualizado]);
        setMensajeExito("Curso creado exitosamente");
        setMostrarFormularioCreacion(false);
      } else {
        setCursos((prev) =>
          prev.map((c) => (c.id === cursoActualizado.id ? cursoActualizado : c))
        );
        setMensajeExito("Curso actualizado exitosamente");
        setCursoEditando(null); 
      }
   
      setMostrarCargaScorm(false);
    } else {
      setMensajeExito("Error actualizando curso");
    }
  };


  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este curso?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/cursos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData: { message?: string } = await res.json();
        throw new Error(errorData.message || 'Error eliminando curso');
      }
      setCursos((prev) => prev.filter((c) => c.id !== id));
      setMensajeExito("Curso eliminado exitosamente");
    } catch (error: unknown) {
      console.error('Error eliminando curso:', error);
      if (error instanceof Error) {
        setMensajeExito(`Error eliminando curso: ${error.message}`);
      } else {
        setMensajeExito(`Error eliminando curso: Error desconocido`);
      }
    }
  };


  const handleUploadScormPackage = async (file: File) => {
    const formData = new FormData();
    formData.append('scormFile', file);
    try {
      const response = await fetch('http://localhost:3001/api/cursos/upload-scorm-zip', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || 'Error desconocido al subir el archivo SCORM .zip.');
      }

      const responseData = await response.json();
      console.log('Respuesta del backend (subida SCORM ZIP):', responseData);
      setMensajeExito('Archivo SCORM subido y procesado con éxito.');
      setMostrarCargaScorm(false);
      fetchCursos();
    } catch (error: unknown) {
      console.error('Error en la subida del SCORM ZIP:', error);
      if (error instanceof Error) {
        setMensajeExito(`Error al subir el archivo SCORM: ${error.message}`);
      } else {
        setMensajeExito(`Error al subir el archivo SCORM: Error desconocido`);
      }
      throw error; 
    }
  };


  const handleCancelarFormulario = () => {
    setMostrarFormularioCreacion(false);
    setMostrarCargaScorm(false);
    setCursoEditando(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--primary)]">Gestión de Cursos</h2>

      {!mostrarFormularioCreacion && !cursoEditando && !mostrarCargaScorm && ( 
        <>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMostrarFormularioCreacion(true);
                setMostrarCargaScorm(false);
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Crear Nuevo Curso
            </button>
            <button
              onClick={() => {
                setMostrarCargaScorm(true);
                setMostrarFormularioCreacion(false);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Subir Paquete SCORM (.zip)
            </button>
          </div>
          <TablaCursosAdmin
            cursos={cursos}
            onEditar={setCursoEditando}
            onEliminar={handleEliminar}
          />
        </>
      )}

      {mostrarFormularioCreacion && (
        <CrearCursoMultiStep
          onCursoCreado={handleCursoGuardado}
          onCancelar={handleCancelarFormulario}
        />
      )}

      {cursoEditando && (
        <EditarCursoAdmin
          curso={cursoEditando}
          onGuardar={handleCursoGuardado}
          onCancelar={handleCancelarFormulario}
        />
      )}

      {mostrarCargaScorm && ( 
        <div className="relative p-4 border rounded-lg bg-white shadow-md"> 
          <button
            onClick={handleCancelarFormulario}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            title="Cerrar"
          >
            &times;
          </button>
          <ScormUploader onUploadScormPackage={handleUploadScormPackage} />
        </div>
      )}

      {mensajeExito && (
        <InlineToast
          mensaje={mensajeExito}
          onClose={() => setMensajeExito("")}
        />
      )}
    </div>
  );
}
