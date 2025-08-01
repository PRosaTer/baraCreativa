'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Curso, CursoForm, EditableModuloForm, ClaseItem } from '@/app/types/curso';
import { ModuloDto, TipoCurso, ModalidadCurso } from '@/app/types/shared-backend-types';

interface UseCursoFormProps {
    curso?: Curso;
    onGuardar: (cursoGuardado: Curso) => Promise<void>;
}

export const useCursoForm = ({ curso, onGuardar }: UseCursoFormProps) => {
    const [form, setForm] = useState<CursoForm>(() => ({
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
        modulos: curso?.modulos
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
            : [],
        newScormFile: null,
        claseItem: curso?.claseItem || ClaseItem.CURSO,
        fechaInicio: curso?.fechaInicio ? new Date(curso.fechaInicio) : null,
    }));

    const [moduloFiles, setModuloFiles] = useState<
        Array<{ videoFile?: File | null; pdfFile?: File | null; imageFile?: File | null }>
    >(curso?.modulos ? curso.modulos.map(() => ({})) : []);

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setForm((prev) => ({ ...prev, [name]: target.checked }));
            return;
        }

        if (name === 'tipo') {
            setForm((prev) => ({ ...prev, tipo: value as TipoCurso }));
            return;
        }
        if (name === 'modalidad') {
            setForm((prev) => ({ ...prev, modalidad: value as ModalidadCurso }));
            return;
        }
        if (name === 'claseItem') {
            const selectedClaseItem = value as ClaseItem;
            setForm((prev) => ({
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

        setForm((prev) => ({
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
            setForm((prev) => ({ ...prev, newScormFile: file }));
            setError('');
        } else if (name === 'imagenCurso') {
            if (!file.type.startsWith('image/')) {
                setError('Solo imágenes permitidas para la imagen del curso');
                return;
            }
            setForm((prev) => ({ ...prev, imagenCurso: file }));
            setError('');
        }
    };

    const handleDateChange = (date: Date | null) => {
        setForm((prev) => ({ ...prev, fechaInicio: date }));
    };

    const handleAddModulo = () => {
        setForm((prev) => ({
            ...prev,
            modulos: [...prev.modulos, { titulo: '', descripcion: null, videoFile: null, pdfFile: null, imageFile: null }],
        }));
        setModuloFiles((prev) => [...prev, {}]);
    };

    const handleRemoveModulo = (index: number) => {
        setForm((prev) => ({
            ...prev,
            modulos: prev.modulos.filter((_, i) => i !== index),
        }));
        setModuloFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleModuloChange = (index: number, field: 'titulo' | 'descripcion', value: string) => {
        setForm((prev) => {
            const newModulos = [...prev.modulos];
            newModulos[index][field] = field === 'descripcion' && value === '' ? null : value;
            return { ...prev, modulos: newModulos };
        });
    };

    const handleModuloFileChange = (
        index: number,
        fileType: 'videoFile' | 'pdfFile' | 'imageFile',
        file: File | null
    ) => {
        setModuloFiles((prev) => {
            const newModuloFiles = [...prev];
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

            let nuevoCurso: Curso;
            if (curso) {
                const resUpdate = await fetch(`${baseUrl}/${curso.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseDataForApi),
                });
                if (!resUpdate.ok) throw new Error((await resUpdate.json()).message || 'Error al actualizar ítem');
                nuevoCurso = await resUpdate.json();
            } else {
                const resCreate = await fetch(baseUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseDataForApi),
                });
                if (!resCreate.ok) throw new Error((await resCreate.json()).message || 'Error al crear ítem');
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
                if (!resScorm.ok) throw new Error((await resScorm.json()).message || 'Error al subir archivo SCORM');
            }

            if (form.imagenCurso instanceof File) {
                const formDataImagen = new FormData();
                formDataImagen.append('imagen', form.imagenCurso);
                const resImg = await fetch(`${baseUrl}/${nuevoCurso.id}/imagen`, {
                    method: 'POST',
                    body: formDataImagen,
                });
                if (!resImg.ok) throw new Error((await resImg.json()).message || 'Error al subir imagen del ítem');
            }

            if (form.claseItem === ClaseItem.CURSO) {
                await Promise.all(
                    moduloFiles.map(async (filesForModule, moduleIndex) => {
                        const currentModulo = nuevoCurso.modulos[moduleIndex];
                        if (!currentModulo || !currentModulo.id) {
                            console.warn(`Módulo en el índice ${moduleIndex} no encontrado o sin ID.`);
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
                                console.error(`Error al subir archivos para el módulo ${currentModulo.id}:`, (await resModuleFiles.json()).message || 'Error desconocido');
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

    return {
        form,
        moduloFiles,
        error,
        exito,
        loading,
        handleChange,
        handleFileChange,
        handleDateChange,
        handleAddModulo,
        handleRemoveModulo,
        handleModuloChange,
        handleModuloFileChange,
        handleSubmit,
    };
};