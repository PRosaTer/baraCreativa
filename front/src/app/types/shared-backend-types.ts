export enum TipoCurso {
  DOCENTES = 'Docentes',
  ESTUDIANTES = 'Estudiantes',
  EMPRESAS = 'Empresas',
}

export enum ModalidadCurso {
  EN_VIVO = 'en vivo',
  GRABADO = 'grabado',
  MIXTO = 'mixto', 
}


export interface ModuloDto {
  id?: number;
  titulo: string;
  descripcion: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  imageUrl?: string | null;
}
