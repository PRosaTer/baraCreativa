import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { Carrito } from './carrito.entity';
import { ContactoSoporte } from './contacto-soporte.entity';
import { Resena } from './resena.entity';
import { Certificado } from './certificado.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
export declare enum TipoUsuario {
    Alumno = "Alumno",
    Empresa = "Empresa",
    Admin = "Admin"
}
export declare enum EstadoCuenta {
    Activo = "activo",
    Inactivo = "inactivo",
    Bloqueado = "bloqueado"
}
export declare class Usuario {
    id: number;
    nombreCompleto: string;
    correoElectronico: string;
    contraseña: string;
    telefono?: string;
    tipoUsuario: TipoUsuario;
    nombreEmpresa?: string;
    fechaRegistro: Date;
    fotoPerfil?: string;
    ultimaSesion: Date;
    estadoCuenta: EstadoCuenta;
    inscripciones: Inscripcion[];
    pagos: Pago[];
    carritos: Carrito[];
    contactosSoporte: ContactoSoporte[];
    resenas: Resena[];
    certificados: Certificado[];
    equipos: EquipoEmpresaMiembro[];
}
