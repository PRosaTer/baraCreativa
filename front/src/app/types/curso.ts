export enum TipoCurso {
  Docentes = 'Docentes',
  Empresas = 'Empresas',
}

export enum ModalidadCurso {
  EnVivo = 'en vivo',
  Grabado = 'grabado',
  Mixto = 'mixto',
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: TipoCurso;
  categoria: string;
  duracionHoras: number;
  precio: number;
  modalidad: ModalidadCurso;
  fechaLanzamiento: string;
  imagenCurso?: string;
  certificadoDisponible: boolean;
  badgeDisponible: boolean;
}
