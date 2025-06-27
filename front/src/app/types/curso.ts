export interface ModuloForm {
  titulo: string;
  descripcion: string;
}

export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string;
  pdfUrl?: string;
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso: string | null;
  archivoScorm?: string | null;
  videoCurso?: string | null;
  pdfCurso?: string | null;
  modulos?: Modulo[];
}
