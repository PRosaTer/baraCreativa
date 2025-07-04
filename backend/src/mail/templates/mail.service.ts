import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


interface TransactionDetails {
  id: string;
  create_time?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
}


@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendPaymentConfirmationToCustomer(
    customerEmail: string,
    customerName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ) {
    try {
      await this.mailerService.sendMail({
        to: customerEmail,
        subject: `Confirmación de Compra del Curso: ${courseTitle}`,
        template: 'customer-payment-confirmation',
        context: {
          customerName,
          courseTitle,
          paymentAmount: paymentAmount.toFixed(2),
          orderId,
          transactionId: transactionDetails.id,
          currency: transactionDetails.amount?.currency_code,
          captureTime: new Date(transactionDetails.create_time || Date.now()).toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }),
        },
      });
      this.logger.log(`Correo de confirmación de pago enviado a: ${customerEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de pago al cliente ${customerEmail}:`, error.response?.data || error.message);
    }
  }

  async sendPaymentNotificationToAdmin(
    adminEmail: string,
    customerEmail: string,
    customerName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ) {
    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `¡Nueva Venta! Curso: ${courseTitle} - ID: ${orderId}`,
        template: 'admin-payment-notification',
        context: {
          customerEmail,
          customerName,
          courseTitle,
          paymentAmount: paymentAmount.toFixed(2),
          orderId,
          transactionId: transactionDetails.id,
          currency: transactionDetails.amount?.currency_code,
          captureTime: new Date(transactionDetails.create_time || Date.now()).toLocaleString('es-AR', { timeZone: 'America/Argentina/Cordoba' }),
        },
      });
      this.logger.log(`Correo de notificación de venta enviado a admin: ${adminEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de venta al admin ${adminEmail}:`, error.response?.data || error.message);
    }
  }


  async sendPasswordRecoveryEmailToUser(
    userEmail: string,
    userName: string,
    recoveryCode: string,
    resetUrl?: string 
  ) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Recuperación de Contraseña - BaraCreativa',
        template: 'password-recovery-user',
        context: {
          userName,
          recoveryCode,
          resetUrl,
        },
      });
      this.logger.log(`Correo de recuperación de contraseña enviado a: ${userEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando correo de recuperación al usuario ${userEmail}:`, error.response?.data || error.message);
    }
  }

  async sendPasswordRecoveryNotificationToAdmin(
    adminEmail: string,
    userEmail: string,
    userName: string,
    recoveryCode: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: `Notificación: Solicitud de Recuperación de Contraseña para ${userName || userEmail}`,
        template: 'password-recovery-admin',
        context: {
          userEmail,
          userName,
          recoveryCode,
        },
      });
      this.logger.log(`Notificación de recuperación de contraseña enviada a admin: ${adminEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando notificación de recuperación al admin ${adminEmail}:`, error.response?.data || error.message);
    }
  }
}