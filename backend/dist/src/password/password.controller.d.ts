import { PasswordService } from './password.service';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';
export declare class PasswordController {
    private readonly passwordService;
    constructor(passwordService: PasswordService);
    solicitar(dto: SolicitarResetDto): Promise<{
        mensaje: string;
    }>;
    confirmar(dto: ConfirmarResetDto): Promise<{
        mensaje: string;
    }>;
}
