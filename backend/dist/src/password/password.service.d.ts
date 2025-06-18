import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';
export declare class PasswordService {
    private usuariosRepo;
    constructor(usuariosRepo: Repository<Usuario>);
    solicitarReset(dto: SolicitarResetDto): Promise<{
        mensaje: string;
    }>;
    confirmarReset(dto: ConfirmarResetDto): Promise<{
        mensaje: string;
    }>;
}
