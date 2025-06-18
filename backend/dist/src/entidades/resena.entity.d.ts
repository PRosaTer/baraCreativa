import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
export declare class Resena {
    id: number;
    usuario: Usuario;
    curso: Curso;
    puntuacion: number;
    comentario: string;
    fechaResena: Date;
}
