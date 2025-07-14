export interface EstadoModuloUsuario {
  id: number;
  titulo: string;
  tipo: 'scorm' | 'video' | 'pdf' | 'imagen' | 'texto';
  orden: number | null;
  urlContenido?: string | null; // URL para video, pdf, imagen, o archivo SCORM
  descripcionContenido?: string | null; // Para módulos tipo texto o descripciones adicionales
  completado: boolean;
  fechaCompletado: Date | null;
}
