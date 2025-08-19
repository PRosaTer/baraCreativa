import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TransactionDetails } from '../interfaces/transaction-details.interface';

export interface PurchaseNotificationData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  paymentAmount: number;
  orderId: string;
  transactionDetails: TransactionDetails;
  tipoUsuario: 'Alumno' | 'Empresa' | 'Instructor' | 'Admin';
  cursosComprados: string[];
  totalComprados: number;
  porcentajeComprados: number;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envía un correo de recibo de compra al cliente.
   * Ahora usa el MailerService inyectado.
   */
  async sendPurchaseReceiptToCustomer(
    userEmail: string,
    userName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: `Gracias por tu compra, ${userName}!`,
        template: 'purchase-receipt-user',
        context: {
          customerName: userName,
          courseTitle,
          paymentAmount,
          orderId,
          transactionId: transactionDetails?.id ?? '',
          captureTime: transactionDetails?.create_time ?? '',
          currency: 'USD',
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Recibo de compra enviado a: ${userEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar el recibo de compra:', error.message, error.stack);
    }
  }

  /**
   * Envía un correo de notificación de compra al administrador.
   * Ahora usa el MailerService inyectado.
   */
  async sendPurchaseNotificationToAdmin(data: PurchaseNotificationData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: this.configService.get<string>('EMAIL_USER'),
        subject: `Nueva compra realizada por ${data.userName}`,
        template: 'admin-purchase-notification',
        context: {
          userName: data.userName,
          userEmail: data.userEmail,
          courseTitle: data.courseTitle,
          paymentAmount: data.paymentAmount,
          orderId: data.orderId,
          transactionId: data.transactionDetails?.id ?? '',
          purchaseDate: data.transactionDetails?.create_time ?? '',
          tipoUsuario: data.tipoUsuario,
          listaCursos: data.cursosComprados,
          totalCursosComprados: data.totalComprados,
          porcentajeCursosComprados: data.porcentajeComprados.toFixed(2),
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Notificación de compra enviada al administrador.`);
    } catch (error) {
      this.logger.error('Error al enviar la notificación al administrador:', error.message, error.stack);
    }
  }

  /**
   * Envía un correo de recuperación de contraseña al usuario.
   * Ahora usa el MailerService inyectado.
   */
  async sendPasswordRecoveryEmailToUser(
    userEmail: string,
    userName: string,
    recoveryCode: string,
    resetUrl: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Recuperación de contraseña',
        template: 'password-recovery-user',
        context: {
          userName,
          recoveryCode,
          resetUrl,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Correo de recuperación enviado con éxito a: ${userEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar el correo de recuperación:', error.message, error.stack);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperación.');
    }
  }

  /**
   * Envía un correo de notificación de recuperación al administrador.
   * Nota: Para esta función, no tienes una plantilla .hbs,
   * por lo que usamos el 'html' en línea, como en tu código original.
   */
  async sendPasswordRecoveryNotificationToAdmin(
    adminEmail: string,
    userEmail: string,
    userName: string,
    recoveryCode: string,
  ): Promise<void> {
    const html = `
      <p>Se ha solicitado una recuperación de contraseña para el usuario:</p>
      <ul>
        <li>Nombre: ${userName}</li>
        <li>Correo: ${userEmail}</li>
        <li>Código de recuperación: ${recoveryCode}</li>
      </ul>
    `;
    
    try {
      await this.mailerService.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: adminEmail,
        subject: 'Notificación de recuperación de contraseña',
        html,
      });
      this.logger.log(`Notificación de recuperación enviada al administrador: ${adminEmail}`);
    } catch (error) {
      this.logger.error('Error al enviar notificación al administrador:', error.message, error.stack);
    }
  }
}
