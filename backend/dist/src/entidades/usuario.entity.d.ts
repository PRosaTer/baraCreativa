import { Carrito } from './carrito.entity';
import { Certificado } from './certificado.entity';
import { ContactoSoporte } from './contacto-soporte.entity';
import { EquipoEmpresaMiembro } from './equipo-empresa.entity';
import { Inscripcion } from './inscripcion.entity';
import { Pago } from './pago.entity';
import { Resena } from './resena.entity';
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
    password: string;
    fotoPerfil?: string;
    esAdmin: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
    tokenRecuperacion: string | null;
    expiracionTokenRecuperacion: Date | null;
    telefono?: string;
    tipoUsuario: TipoUsuario;
    nombreEmpresa?: string;
    ultimaSesion?: Date;
    estadoCuenta: EstadoCuenta;
    carritos: Carrito[];
    certificados: Certificado[];
    contactosSoporte: ContactoSoporte[];
    equipos: EquipoEmpresaMiembro[];
    inscripciones: Inscripcion[];
    pagos: Pago[];
    resenas: Resena[];
}
