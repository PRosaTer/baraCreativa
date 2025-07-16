export interface MarcarModuloCompletadoDto {
  cursoId: number;
  moduloId: number;
}

export interface EstadoModuloUsuario {
  id: number;
  titulo: string;
  tipo: 'scorm' | 'video' | 'pdf' | 'imagen' | 'texto';
  orden: number | null;
  videoUrls?: string[] | null; 
  pdfUrls?: string[] | null; 
  imageUrls?: string[] | null; 
  urlContenido?: string | null; 
  descripcionContenido?: string | null;
  completado: boolean;
  fechaCompletado: Date | null;
}
