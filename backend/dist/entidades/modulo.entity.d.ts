import { Curso } from './curso.entity';
export declare class Modulo {
    id: number;
    titulo: string;
    descripcion: string;
    orden: number;
    videoUrl?: string;
    curso: Curso;
}
