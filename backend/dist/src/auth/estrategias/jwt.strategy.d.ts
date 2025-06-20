import { Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuarios.service';
interface JwtPayload {
    sub: number;
    correoElectronico: string;
}
interface UserFromJwtValidation {
    id: number;
    nombreCompleto: string;
    correoElectronico: string;
    telefono?: string;
    tipoUsuario?: string;
    nombreEmpresa?: string;
    fotoPerfil?: string;
    estadoCuenta?: string;
    esAdmin: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
    ultimaSesion?: Date;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usuariosService;
    constructor(configService: ConfigService, usuariosService: UsuariosService);
    validate(payload: JwtPayload): Promise<UserFromJwtValidation>;
}
export {};
