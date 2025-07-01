export interface ModuloForm {
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;


  videos: File[];
  pdfs: File[];
  imagenes: File[];
}

export interface Modulo {
  id?: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
}


export interface EditableModuloForm extends ModuloForm {
  id?: number;
}

export interface Curso {
  id: number; 
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas' | '';
  categoria: string;
  duracionHoras: number;
  precio: number | string;
  modalidad: 'en vivo' | 'grabado' | 'mixto' | '';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: string | null;
  archivoScorm?: string | null;
  videoCurso?: string | null;
  pdfCurso?: string | null;
  modulos?: Modulo[];

  imagenUrl?: string | null;
  certificacion?: boolean;
}

export interface CursoForm {
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas' | '';
  categoria: string;
  duracionHoras: number | '';
  precio: number | '';
  modalidad: 'en vivo' | 'grabado' | 'mixto' | '';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso: File | null;
  modulos: EditableModuloForm[]; 
}
