import { Controller, Post, Body } from '@nestjs/common';
import { PasswordService } from './password.service';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('solicitar')
  solicitar(@Body() dto: SolicitarResetDto) {
    return this.passwordService.solicitarReset(dto);
  }

  @Post('confirmar')
  confirmar(@Body() dto: ConfirmarResetDto) {
    return this.passwordService.confirmarReset(dto);
  }
}
