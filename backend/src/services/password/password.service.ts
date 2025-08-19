import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Usuario } from 'src/entidades/usuario.entity';
import { SolicitarResetDto } from '../../dto/password/solicitar-reset.dto';
import { ConfirmarResetDto } from '../../dto/password/confirmar-reset.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async solicitarReset(dto: SolicitarResetDto) {
    const usuario = await this.usuariosRepo.findOne({
      where: { correoElectronico: ILike(dto.correoElectronico) },
    });

    if (!usuario) {
      throw new NotFoundException('Este correo no pertenece a un usuario registrado');
    }

    const token = randomUUID();
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    usuario.tokenRecuperacion = token;
    usuario.expiracionTokenRecuperacion = expiracion;
    await this.usuariosRepo.save(usuario);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const enlace = `${frontendUrl}/password/restablecer?token=${token}`;

    try {
      await this.mailService.sendPasswordRecoveryEmailToUser(
        usuario.correoElectronico, 
        usuario.nombreCompleto, 
        token,                  
        enlace,    
      );
    } catch (error) {
      console.error('Error enviando mail de recuperación:', error);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperación.');
    }

    return {
      mensaje: 'Se ha enviado un correo con el enlace para restablecer tu contraseña.',
    };
  }

  async confirmarReset(dto: ConfirmarResetDto) {
    const usuario = await this.usuariosRepo.findOne({
      where: { tokenRecuperacion: dto.token },
    });

    if (!usuario) {
      throw new BadRequestException('Token inválido');
    }

    if (!usuario.expiracionTokenRecuperacion || usuario.expiracionTokenRecuperacion < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    usuario.password = hash;
    usuario.tokenRecuperacion = null;
    usuario.expiracionTokenRecuperacion = null;

    await this.usuariosRepo.save(usuario);

    return { mensaje: 'Contraseña restablecida con éxito' };
  }
}
