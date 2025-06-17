import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
export declare enum EstadoCarrito {
    Activo = "activo",
    Abandonado = "abandonado",
    Comprado = "comprado"
}
export declare class Carrito {
    id: number;
    usuario: Usuario;
    cursos: Curso[];
    fechaCreacion: Date;
    estado: EstadoCarrito;
}
