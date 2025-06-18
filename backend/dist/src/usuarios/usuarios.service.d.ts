import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
export declare class UsuariosService {
    private usuariosRepository;
    constructor(usuariosRepository: Repository<Usuario>);
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    encontrarPorCorreo(correoElectronico: string): Promise<Usuario | null>;
    create(usuarioData: CreateUsuarioDto): Promise<Usuario>;
    update(id: number, usuarioData: Partial<Usuario>): Promise<Usuario>;
    remove(id: number): Promise<void>;
}
