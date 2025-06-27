export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string;
  pdfUrl?: string;  
}


export interface ModuloForm {
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
  precio: number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso: string | null;
  modulos?: Modulo[]; 
}


export interface CursoForm {
  titulo: string;
  descripcion: string;
  tipo: 'Docentes' | 'Empresas';
  categoria: string;
  duracionHoras: number;
  precio: number;
  modalidad: 'en vivo' | 'grabado' | 'mixto';
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
  imagenCurso?: File | null;
  modulos: ModuloForm[];
}
