export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number | string;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: string | null;
  modulos?: Modulo[];
}