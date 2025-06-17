import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
export declare class Certificado {
    id: number;
    usuario: Usuario;
    curso: Curso;
    codigoUnico: string;
    fechaEmision: Date;
    urlDescarga: string;
    verificado: boolean;
}
