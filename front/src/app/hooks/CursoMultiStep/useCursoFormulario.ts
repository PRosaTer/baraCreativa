import { useState, ChangeEvent, FormEvent } from "react";
import { CursoForm, Curso, EditableModuloForm } from "@/app/types/curso";

interface UseCursoFormularioReturn {
  step: number;
  form: CursoForm;
  error: string;
  exito: string;
  loading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAddModulo: () => void;
  handleRemoveModulo: (index: number) => void;
  handleModuloTitleChange: (index: number, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<CursoForm>>;
}

export const useCursoFormulario = (
  onGuardar: (curso: Curso) => Promise<void>,
  routerPush: (path: string) => void
): UseCursoFormularioReturn => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CursoForm>({
    titulo: "",
    descripcion: "",
    precio: "",
    duracionHoras: "",
    tipo: "",
    categoria: "",
    subcategoria: null,
    modalidad: "",
    certificadoDisponible: false,
    badgeDisponible: false,
    imagenCurso: null,
    archivoScorm: null,
    modulos: [],
    newScormFile: null,
    claseItem: "",
    fechaInicio: null,
  });

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "duracionHoras"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (name === "imagenCurso") {
      if (!file.type.startsWith("image/")) {
        setError("Solo imágenes permitidas para la imagen del curso");
        setForm((prev) => ({ ...prev, imagenCurso: null }));
        return;
      }
      setForm((prev) => ({ ...prev, imagenCurso: file }));
      setError("");
    } else if (name === "archivoScorm") {
      if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
        setError("Solo archivos .zip permitidos para SCORM");
        setForm((prev) => ({ ...prev, archivoScorm: null }));
        return;
      }
      setForm((prev) => ({ ...prev, archivoScorm: file }));
      setError("");
    }
  };

  const handleAddModulo = () => {
    setForm((prev) => ({
      ...prev,
      modulos: [
        ...prev.modulos,
        {
          id: Date.now(),
          titulo: `Módulo ${prev.modulos.length + 1}`,
          descripcion: null,
          videoUrl: null,
          pdfUrl: null,
          imageUrl: null,
          videoFile: [],
          pdfFile: [],
          imageFile: [],
        },
      ],
    }));
  };

  const handleRemoveModulo = (index: number) => {
    setForm((prev) => ({
      ...prev,
      modulos: prev.modulos.filter((_, i) => i !== index),
    }));
  };

  const handleModuloTitleChange = (index: number, value: string) => {
    setForm((prev) => {
      const newModulos: EditableModuloForm[] = [...prev.modulos];
      newModulos[index] = { ...newModulos[index], titulo: value };
      return { ...prev, modulos: newModulos };
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setExito("");
    setLoading(true);

    if (form.claseItem === "") {
      setError("Por favor, selecciona una Clase de Ítem.");
      setLoading(false);
      return;
    }
    if (form.tipo === "") {
      setError("Por favor, selecciona un Tipo de Curso.");
      setLoading(false);
      return;
    }
    if (form.modalidad === "") {
      setError("Por favor, selecciona una Modalidad.");
      setLoading(false);
      return;
    }

    try {
      const cursoDataToCreate = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        duracionHoras: Number(form.duracionHoras),
        tipo: form.tipo,
        categoria: form.categoria,
        subcategoria: form.subcategoria,
        modalidad: form.modalidad,
        certificadoDisponible: form.certificadoDisponible,
        badgeDisponible: form.badgeDisponible,
        claseItem: form.claseItem,
        fechaInicio: form.fechaInicio,
        modulos: form.modulos.map((m) => ({
          titulo: m.titulo,
          descripcion: m.descripcion || null,
        })),
      };

      const resCurso = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(cursoDataToCreate),
        credentials: "include",
      });

      if (!resCurso.ok) {
        const errData = await resCurso.json();
        throw new Error(errData.message || "Error al crear el curso");
      }
      const newCurso: Curso = await resCurso.json();
      const cursoId = newCurso.id;

      if (form.imagenCurso instanceof File) {
        const formDataImagen = new FormData();
        formDataImagen.append("imagen", form.imagenCurso);
        const resImg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoId}/imagen`, {
          method: "POST",
          body: formDataImagen,
          credentials: "include",
        });
        if (!resImg.ok) {
          const errData = await resImg.json();
          console.error("Error al subir imagen del curso:", errData);
          throw new Error(errData.message || "Error al subir imagen del curso");
        }
      }

      if (form.archivoScorm instanceof File) {
        const formDataScorm = new FormData();
        formDataScorm.append("scormFile", form.archivoScorm);
        formDataScorm.append("cursoId", cursoId.toString());
        const resScorm = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos/scorm_unzipped_courses`, {
          method: "POST",
          body: formDataScorm,
          credentials: "include",
        });
        if (!resScorm.ok) {
          const errData = await resScorm.json();
          console.error("Error al subir archivo SCORM:", errData);
          throw new Error(errData.message || "Error al subir archivo SCORM");
        }
      }

      const updatedCursoWithModulos = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/${cursoId}`,
        { credentials: "include" }
      ).then((res) => res.json());

      for (let i = 0; i < updatedCursoWithModulos.modulos.length; i++) {
        const moduloBackend = updatedCursoWithModulos.modulos[i];
        const moduloForm = form.modulos[i];

        const moduloId = moduloBackend.id;
        const formDataModuleFiles = new FormData();
        let filesAttached = false;

        if (moduloForm.videoFile && moduloForm.videoFile.length > 0) {
          moduloForm.videoFile.forEach((file) => formDataModuleFiles.append("files", file));
          filesAttached = true;
        }
        if (moduloForm.pdfFile && moduloForm.pdfFile.length > 0) {
          moduloForm.pdfFile.forEach((file) => formDataModuleFiles.append("files", file));
          filesAttached = true;
        }
        if (moduloForm.imageFile && moduloForm.imageFile.length > 0) {
          moduloForm.imageFile.forEach((file) => formDataModuleFiles.append("files", file));
          filesAttached = true;
        }
        if (filesAttached) {
          const resModuleFiles = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cursos/modulos/${moduloId}/files`,
            {
              method: "POST",
              body: formDataModuleFiles,
              credentials: "include",
            }
          );

          if (!resModuleFiles.ok) {
            const errData = await resModuleFiles.json();
            console.error(`Error al subir archivos para el módulo ${moduloId}:`, errData.message || "Error desconocido");
          }
        }
      }

      setExito("Curso creado y archivos subidos correctamente");
      await onGuardar(newCurso);
      routerPush("/perfil");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    form,
    error,
    exito,
    loading,
    handleChange,
    handleFileChange,
    handleAddModulo,
    handleRemoveModulo,
    handleModuloTitleChange,
    nextStep,
    prevStep,
    handleSubmit,
    setForm,
  };
};
