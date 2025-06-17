import { Usuario } from './usuario.entity';
export declare enum TipoConsulta {
    Tecnica = "t\u00E9cnica",
    Administrativa = "administrativa",
    Academica = "acad\u00E9mica"
}
export declare enum EstadoCaso {
    Pendiente = "pendiente",
    EnRevision = "en revisi\u00F3n",
    Cerrado = "cerrado"
}
export declare class ContactoSoporte {
    id: number;
    usuario: Usuario;
    fechaMensaje: Date;
    tipoConsulta: TipoConsulta;
    mensaje: string;
    estadoCaso: EstadoCaso;
}
