'use client';

import { useState, useEffect } from 'react';
import { Curso } from '@/app/types/curso';
import { useCursoScorm } from '@/app/hooks/Scorm/useCursoScorm';
import ListaModulos from '@/components/Scorm/ListaModulos';
import NavegacionModulos from '@/components/Scorm/Navegacion';

export default function CursosPage() {
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Efecto para cargar los datos del curso desde la API
    useEffect(() => {
        const fetchCursoData = async () => {
            try {
                setLoading(true);
                // Esta es la lógica real para obtener datos.
                // Si el cursoId fuera dinámico, se obtendría de los parámetros de la URL.
                // Dado que este es un archivo de página estático, se podría obtener una lista
                // de cursos o un curso con un ID fijo.
                const response = await fetch(`/api/cursos`); // Ejemplo de una llamada a tu API
                if (!response.ok) {
                    throw new Error('Error al obtener el curso');
                }
                const cursos: Curso[] = await response.json();
                
                // Suponiendo que la API devuelve un array, se toma el primer curso
                if (cursos.length > 0) {
                    setCurso(cursos[0]);
                } else {
                    setCurso(null);
                }

                setError(null);
            } catch (err: unknown) {
                console.error(err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Ocurrió un error desconocido.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCursoData();
    }, []);

    // Usa el hook SOLO si los datos del curso están cargados
    const {
        modulosEstadoUsuario,
        currentModuleIndex,
        progresoGeneral,
        handleModuleClick,
        handleNavigation,
        disablePrev,
        disableNext,
    } = useCursoScorm(curso?.modulos || []);

    if (loading) return <div>Cargando curso...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!curso) return <div>No se encontró el curso.</div>;

    const currentModule = modulosEstadoUsuario[currentModuleIndex] || null;

    return (
        <div>
            <h1>{curso.titulo}</h1>
            <p>Progreso del curso: {progresoGeneral.toFixed(2)}%</p>
            <ListaModulos
                modulos={modulosEstadoUsuario}
                currentModuleIndex={currentModuleIndex}
                onModuleClick={handleModuleClick}
            />
            {currentModule && (
                <div>
                    {/* Se ha corregido la propiedad de 'nombre' a 'titulo' */}
                    <h2>{currentModule.titulo}</h2>
                    {/* Renderiza el contenido aquí, similar a lo que hiciste en tu código */}
                </div>
            )}
            <NavegacionModulos
                onNavigate={handleNavigation}
                disablePrev={disablePrev}
                disableNext={disableNext}
            />
        </div>
    );
}
