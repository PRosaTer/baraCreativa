import { TipoUsuario, EstadoCuenta } from '../../entidades/usuario.entity';
export declare class CreateUsuarioDto {
    nombreCompleto: string;
    correoElectronico: string;
    password: string;
    telefono?: string;
    tipoUsuario: TipoUsuario;
    nombreEmpresa?: string;
    fotoPerfil?: string;
    estadoCuenta?: EstadoCuenta;
}
