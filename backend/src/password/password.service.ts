import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Usuario } from 'src/entidades/usuario.entity';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { crearTransportador } from 'src/config/mail.config';

@Injectable()
export class PasswordService {
  private transporter;

  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private configService: ConfigService,
  ) {
    this.transporter = crearTransportador(this.configService);
  }

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

    const enlace = `http://localhost:3000/password/restablecer?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Bara Creativa" <${this.configService.get('EMAIL_USER')}>`,
        to: usuario.correoElectronico,
        subject: 'Restablecer contraseña - Bara Creativa',
        html: `
          <p>Hola ${usuario.nombreCompleto},</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${enlace}">${enlace}</a>
          <p>Este enlace expirará en 1 hora.</p>
        `,
      });
    } catch (error) {
      console.error('Error enviando mail:', error);
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
