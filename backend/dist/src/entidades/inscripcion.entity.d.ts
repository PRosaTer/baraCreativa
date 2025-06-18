import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
export declare enum EstadoCurso {
    EnProgreso = "en progreso",
    Completado = "completado",
    Abandonado = "abandonado"
}
export declare class Inscripcion {
    id: number;
    usuario: Usuario;
    curso: Curso;
    fechaInscripcion: Date;
    estadoCurso: EstadoCurso;
    progreso: number;
    fechaFinalizacion?: Date;
}
