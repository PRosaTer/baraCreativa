'use client';

import { useParams } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

import { useCursoScorm } from '@/app/hooks/Scorm/useCursoScorm';

import BarraProgreso from '@/components/Scorm/BarraProgreso';
import ListaModulos from '@/components/Scorm/ListaModulos';
import MensajeFinal from '@/components/Scorm/MensajeFinal';
import Navegacion from '@/components/Scorm/Navegacion';
import ContenedorContenido from '@/components/Scorm/ContenedorContenido';

export default function ScormPage() {
  const params = useParams();
  const cursoId = params.id as string;

  const {
    modulosDelCurso,
    currentModuleIndex,
    setCurrentModuleIndex,
    currentContentIndex,
    setCurrentContentIndex,
    error,
    loading,
    cursoCompletadoGeneral,
    markCourseAsCompletedGeneral,
    marcarModuloCompletadoBackend,
    handleNavigation, 
    handleModuleClick,
    progresoGeneral,
    currentModule,
    currentContentUrl,
    isPrevContentDisabled,
    isNextContentDisabled,
  } = useCursoScorm(cursoId);

  if (loading) return <p className="text-center mt-8">Cargando curso...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
  if (!currentModule) return <p className="text-center mt-8">No hay módulos disponibles para este curso.</p>;

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 gap-4">
        <div className="lg:w-1/4 bg-white rounded-lg shadow-lg p-6 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Módulos del Curso</h2>
          <BarraProgreso progreso={progresoGeneral} />
          <ListaModulos
            modulos={modulosDelCurso}
            currentModuleIndex={currentModuleIndex}
            onModuleClick={handleModuleClick}
          />
        </div>


        <div className="lg:w-3/4 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <MensajeFinal mostrar={cursoCompletadoGeneral} />

          <h1 className="text-3xl font-bold mb-4 text-gray-900">{currentModule.titulo}</h1>
          <p className="text-gray-600 mb-6">{currentModule.descripcionContenido}</p>

     
          <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <ContenedorContenido
              tipo={currentModule.tipo}
              urlContenido={currentModule.tipo !== 'texto' ? currentContentUrl : undefined}
              contenidoTexto={currentModule.tipo === 'texto' ? currentModule.descripcionContenido : undefined}
            />
          </div>

       
          <Navegacion
            onNavigate={handleNavigation} 
            disablePrev={isPrevContentDisabled}
            disableNext={isNextContentDisabled}
          />


          <div className="mt-6 text-center">
            <button
              onClick={markCourseAsCompletedGeneral}
              disabled={progresoGeneral < 100 || cursoCompletadoGeneral}
              className={`px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg
                ${progresoGeneral === 100 && !cursoCompletadoGeneral
                  ? 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
                }`}
            >
              {cursoCompletadoGeneral ? 'Curso Ya Completado 🎉' : 'Marcar Curso como Completado'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}