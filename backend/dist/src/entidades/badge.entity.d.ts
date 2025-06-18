import { Curso } from './curso.entity';
export declare class Badge {
    id: number;
    nombre: string;
    descripcion: string;
    iconoUrl: string;
    criterios: string;
    curso?: Curso;
}
