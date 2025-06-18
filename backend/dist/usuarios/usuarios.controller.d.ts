import { UsuariosService } from './usuarios.service';
import { Usuario } from '../entidades/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    getAll(): Promise<Usuario[]>;
    getOne(id: string): Promise<Usuario>;
    create(usuarioData: CreateUsuarioDto): Promise<Usuario>;
    update(id: string, usuarioData: Partial<Usuario>): Promise<Usuario>;
    remove(id: string): Promise<void>;
}
