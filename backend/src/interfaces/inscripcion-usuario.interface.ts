export interface CursoInscritoUsuario {
  id: number;
  titulo: string;
  descripcion: string | null;
  fechaInicio: Date | null;
  imagenCurso: string | null;
}
