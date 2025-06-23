import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../entidades/usuario.entity';
interface UserRequest extends Request {
    user: Usuario;
}
export declare class AuthController {
    private readonly authService;
    private readonly usuariosService;
    constructor(authService: AuthService, usuariosService: UsuariosService);
    login(datos: {
        correoElectronico: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: UserRequest): Usuario;
    logout(req: UserRequest): Promise<{
        message: string;
    }>;
    getAllUsersForAdmin(req: UserRequest): Promise<Usuario[]>;
}
export {};
