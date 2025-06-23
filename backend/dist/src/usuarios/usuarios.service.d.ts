import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
export declare class UsuariosService {
    private usuariosRepository;
    constructor(usuariosRepository: Repository<Usuario>);
    encontrarPorId(id: number): Promise<Usuario | null>;
    encontrarPorCorreo(correoElectronico: string): Promise<Usuario | null>;
    findAll(): Promise<Usuario[]>;
    findOne(id: number): Promise<Usuario>;
    create(usuarioData: Partial<Usuario>): Promise<Usuario>;
    update(id: number, usuarioData: Partial<Usuario>): Promise<Usuario>;
    remove(id: number): Promise<void>;
    logout(userId: number): Promise<void>;
}
