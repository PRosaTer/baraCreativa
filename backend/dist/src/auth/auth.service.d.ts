import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usuariosService;
    private readonly jwtService;
    constructor(usuariosService: UsuariosService, jwtService: JwtService);
    validarUsuarioYGenerarToken(correoElectronico: string, password: string): Promise<string | null>;
    logout(userId: number): Promise<void>;
}
