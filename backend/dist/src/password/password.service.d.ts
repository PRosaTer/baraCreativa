import { Repository } from 'typeorm';
import { Usuario } from 'src/entidades/usuario.entity';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';
import { ConfigService } from '@nestjs/config';
export declare class PasswordService {
    private usuariosRepo;
    private configService;
    private transporter;
    constructor(usuariosRepo: Repository<Usuario>, configService: ConfigService);
    solicitarReset(dto: SolicitarResetDto): Promise<{
        mensaje: string;
    }>;
    confirmarReset(dto: ConfirmarResetDto): Promise<{
        mensaje: string;
    }>;
}
