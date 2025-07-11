import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../../entidades/usuario.entity'; 
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { MailService } from '../../services/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private adminEmail: string;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    const emailUserConfig = this.configService.get('email.user', { infer: true });
    if (!emailUserConfig) {
      throw new Error('La variable de entorno EMAIL_USER (para el correo del administrador) no está configurada. Por favor, verifique su archivo .env');
    }
    this.adminEmail = emailUserConfig as string;
  }

  async validarUsuarioYGenerarToken(
    correoElectronico: string,
    password: string,
  ): Promise<string | null> {
    const usuario = await this.usuariosService.encontrarPorCorreo(correoElectronico);

    if (!usuario) return null;

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return null;

    await this.usuariosService.update(usuario.id, {
      ultimaSesion: new Date(),
      estaConectado: true,
    });

    const payload = {
      sub: usuario.id,
      correoElectronico: usuario.correoElectronico,
    };

    return this.jwtService.sign(payload);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { correoElectronico: email } });
    if (!user) {
      this.logger.warn(`Intento de recuperación de contraseña para correo no registrado: ${email}`);
      return { message: 'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.' };
    }

    const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const recoveryExpires = new Date(Date.now() + 3600000);

    user.tokenRecuperacion = recoveryCode; 
    user.expiracionTokenRecuperacion = recoveryExpires;
    await this.userRepository.save(user);

    const userName = user.nombreCompleto || user.correoElectronico;


    const resetUrl = `http://localhost:3000/password/restablecer?token=${recoveryCode}`;


    await this.mailService.sendPasswordRecoveryEmailToUser(
      user.correoElectronico,
      userName,
      recoveryCode,
      resetUrl
    );

    if (this.adminEmail) {
      await this.mailService.sendPasswordRecoveryNotificationToAdmin(
        this.adminEmail,
        user.correoElectronico,
        userName,
        recoveryCode,
      );
    } else {
      this.logger.warn('No se envió notificación de recuperación de contraseña al admin: EMAIL_USER no configurado.');
    }

    return { message: 'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.' };
  }


  async resetPassword(token: string, newPasswordPlain: string) {
    const user = await this.userRepository.findOne({
      where: {
        tokenRecuperacion: token,
      },
    });

 
    if (!user || !user.expiracionTokenRecuperacion || user.expiracionTokenRecuperacion < new Date()) {
      throw new BadRequestException('El enlace para restablecer la contraseña es inválido o ha expirado.');
    }


    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPasswordPlain, saltRounds);


    user.password = hashedPassword;
    user.tokenRecuperacion = null;
    user.expiracionTokenRecuperacion = null;

    await this.userRepository.save(user);

    return { message: 'Contraseña restablecida correctamente.' };
  }
}