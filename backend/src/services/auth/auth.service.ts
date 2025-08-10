import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario, TipoUsuario, EstadoCuenta } from '../../entidades/usuario.entity';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
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
      throw new Error(
        'La variable de entorno EMAIL_USER (para email de administrador) no está configurada. Por favor, verifique su archivo .env',
      );
    }
    this.adminEmail = emailUserConfig as string;
  }

  async validarUsuarioYGenerarToken(
    correoElectronico: string,
    password: string,
  ): Promise<string | null> {
    const usuario = await this.usuariosService.encontrarPorCorreo(correoElectronico);
    if (!usuario) return null;
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return null;

    const payload = {
      sub: usuario.id,
      correoElectronico: usuario.correoElectronico,
    };

    return this.jwtService.sign(payload);
  }

  async registrarUsuario(data: {
    nombreCompleto: string;
    correoElectronico: string;
    password: string;
    telefono?: string | null;
    tipoUsuario: TipoUsuario;
    nombreEmpresa?: string | null;
    fotoPerfil?: string | null;
  }): Promise<Usuario> {
    const usuarioExistente = await this.userRepository.findOne({
      where: { correoElectronico: data.correoElectronico },
    });
    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está registrado.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const nuevoUsuario = this.userRepository.create(
      {
        nombreCompleto: data.nombreCompleto,
        correoElectronico: data.correoElectronico,
        password: hashedPassword,
        telefono: data.telefono ?? null,
        tipoUsuario: data.tipoUsuario,
        nombreEmpresa:
          data.tipoUsuario === TipoUsuario.Empresa ? data.nombreEmpresa ?? null : null,
        fotoPerfil: data.fotoPerfil ?? null,
        estadoCuenta: EstadoCuenta.Activo,
        esAdmin: data.tipoUsuario === TipoUsuario.Admin,
        estaConectado: false,
        tokenRecuperacion: null,
        expiracionTokenRecuperacion: null,
      } as DeepPartial<Usuario>,
    );

    return await this.userRepository.save(nuevoUsuario);
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { correoElectronico: email } });
    if (!user) {
      this.logger.warn(
        `Intento de recuperación de contraseña para correo no registrado: ${email}`,
      );
      return {
        message:
          'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
      };
    }

    const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const recoveryExpires = new Date(Date.now() + 3600000);

    user.tokenRecuperacion = recoveryCode;
    user.expiracionTokenRecuperacion = recoveryExpires;

    await this.userRepository.save(user);

    const userName = user.nombreCompleto || user.correoElectronico;

    const frontendEnv = this.configService.get('FRONTEND_URL') ?? '';
    const frontendBase = frontendEnv ? frontendEnv.replace(/\/+$/g, '') : 'http://localhost:3000';
    const resetUrl = `${frontendBase}/password/restablecer?token=${recoveryCode}`;

    try {
      await this.mailService.sendPasswordRecoveryEmailToUser(
        user.correoElectronico,
        userName,
        recoveryCode,
        resetUrl,
      );

      if (this.adminEmail) {
        await this.mailService.sendPasswordRecoveryNotificationToAdmin(
          this.adminEmail,
          user.correoElectronico,
          userName,
          recoveryCode,
        );
      }
    } catch (error) {
      this.logger.error('Error enviando email de recuperación de contraseña', error);
      return {
        message:
          'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
      };
    }

    return {
      message:
        'Si tu correo está registrado, recibirás un enlace/código para restablecer tu contraseña.',
    };
  }

  async resetPassword(token: string, newPasswordPlain: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { tokenRecuperacion: token } });

    if (
      !user ||
      !user.expiracionTokenRecuperacion ||
      user.expiracionTokenRecuperacion < new Date()
    ) {
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
