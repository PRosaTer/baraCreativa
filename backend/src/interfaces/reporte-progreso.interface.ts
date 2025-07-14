export interface MarcarModuloCompletadoDto {
  moduloId: number;
  cursoId: number;
}

export interface EstadoModuloUsuario {
  id: number;
  titulo: string;
  tipo: 'scorm' | 'video' | 'pdf' | 'imagen' | 'texto';
  orden: number | null;
  urlContenido?: string | null;
  descripcionContenido?: string | null; 
  completado: boolean;
  fechaCompletado: Date | null;
}
