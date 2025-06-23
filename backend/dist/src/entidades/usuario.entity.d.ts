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
    telefono?: string;
    tipoUsuario: TipoUsuario;
    nombreEmpresa?: string;
    estadoCuenta: EstadoCuenta;
    estaConectado: boolean;
    esAdmin: boolean;
    ultimaSesion?: Date;
    creadoEn: Date;
    actualizadoEn: Date;
    tokenRecuperacion: string | null;
    expiracionTokenRecuperacion: Date | null;
    fotoPerfil?: string;
    carritos: Carrito[];
    certificados: Certificado[];
    contactosSoporte: ContactoSoporte[];
    equipos: EquipoEmpresaMiembro[];
    inscripciones: Inscripcion[];
    pagos: Pago[];
    resenas: Resena[];
}
