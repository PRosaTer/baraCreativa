export interface Modulo {
  id?: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  imageUrl?: string | null;
}

export interface ModuloFormBase {
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  imageUrl?: string | null;
}

export interface EditableModuloForm extends ModuloFormBase {
  id?: number;
  videoFile?: File | null;
  pdfFile?: File | null;
  imageFile?: File | null;
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  duracionHoras: number;
  tipo: 'Docentes' | 'Estudiantes' | 'Empresas';
  categoria: string;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: string | null;
  archivoScorm?: string | null;
  modulos: Modulo[]; // ✅ Lo dejamos siempre definido (no opcional)
}

export interface CursoForm {
  id?: number;
  titulo: string;
  descripcion: string;
  precio: number | '';
  duracionHoras: number | '';
  tipo: 'Docentes' | 'Estudiantes' | 'Empresas' | '';
  categoria: string;
  modalidad: 'en vivo' | 'grabado' | 'mixto' | '';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: File | string | null;
  archivoScorm?: string | null; // ✅ La dejamos string | null (no File), porque se usa el newScormFile para el File
  modulos: EditableModuloForm[]; // ✅ Lo dejamos siempre obligatorio (sin ?)
  newScormFile?: File | null;
}
