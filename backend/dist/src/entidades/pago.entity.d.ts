import { Usuario } from './usuario.entity';
import { Curso } from './curso.entity';
export declare enum EstadoPago {
    Exitoso = "exitoso",
    Fallido = "fallido",
    Pendiente = "pendiente"
}
export declare class Pago {
    id: number;
    usuario: Usuario;
    curso: Curso;
    fechaPago: Date;
    montoPagado: number;
    medioPago: string;
    estadoPago: EstadoPago;
    codigoTransaccion: string;
    datosRecibo?: string;
    pagosCuotas?: string;
    descuentos?: string;
}
