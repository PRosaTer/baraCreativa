import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { SolicitarResetDto } from './dto/solicitar-reset.dto';
import { ConfirmarResetDto } from './dto/confirmar-reset.dto';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
  ) {}

  async solicitarReset(dto: SolicitarResetDto) {
    const usuario = await this.usuariosRepo.findOne({ where: { correoElectronico: dto.correoElectronico } });

    if (!usuario) {
      throw new NotFoundException('No se encontró un usuario con ese correo');
    }

    const token = randomUUID();
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    usuario.tokenRecuperacion = token;
    usuario.expiracionTokenRecuperacion = expiracion;

    await this.usuariosRepo.save(usuario);

    console.log(`🔐 Token para reset: ${token}`);

    return { mensaje: 'Se ha enviado un correo con el enlace para restablecer tu contraseña.' };
  }

  async confirmarReset(dto: ConfirmarResetDto) {
    const usuario = await this.usuariosRepo.findOne({ where: { tokenRecuperacion: dto.token } });

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
