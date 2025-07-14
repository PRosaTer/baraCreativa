import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PurchaseNotificationData } from '../interfaces/purchase-notification-data.interface';

@Injectable()
export class PurchaseMailService {
  private readonly logger = new Logger(PurchaseMailService.name);
  private readonly senderEmail: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    if (!emailUser) {
      const errorMessage = 'La variable de entorno EMAIL_USER no está configurada.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
    this.senderEmail = emailUser;
  }

  async sendPurchaseReceiptToCustomer(customerEmail: string, data: PurchaseNotificationData) {
    try {
      await this.mailerService.sendMail({
        from: `BaraCreativa <${this.senderEmail}>`,
        to: customerEmail,
        subject: `Boleta de compra - Curso: ${data.courseTitle}`,
        template: 'customer-purchase-receipt', 
        context: {
          customerName: data.userName,
          courseTitle: data.courseTitle,
          paymentAmount: data.paymentAmount.toFixed(2),
          currency: data.transactionDetails.amount.currency_code,
          startDate: data.startDate ?? 'Automáticamente',
          orderId: data.orderId,
          transactionId: data.transactionDetails.id,
          captureTime: new Date(data.transactionDetails.create_time)
            .toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Boleta de compra enviada a: ${customerEmail}`);
    } catch (error) {
      this.logger.error(
        `Error enviando boleta al cliente ${customerEmail}:`,
        error.response?.data || error.message,
      );
    }
  }

  async sendPurchaseNotificationToAdmin(data: PurchaseNotificationData) {
    try {
      await this.mailerService.sendMail({
        from: `BaraCreativa <${this.senderEmail}>`,
        to: this.senderEmail, 
        subject: `¡Nueva compra realizada! - ${data.courseTitle}`,
        template: 'admin-purchase-notification',
        context: {
          userName: data.userName,
          userEmail: data.userEmail,
          courseTitle: data.courseTitle,
          paymentAmount: data.paymentAmount.toFixed(2),
          orderId: data.orderId,
          transactionId: data.transactionDetails.id,
          purchaseDate: new Date(data.transactionDetails.create_time).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
          tipoUsuario: data.tipoUsuario,
          totalCursosComprados: data.totalComprados,
          listaCursos: data.cursosComprados,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Notificación de nueva compra enviada al admin para el curso: ${data.courseTitle}`);
    } catch (error) {
      this.logger.error(
        `Error enviando notificación de compra al admin para el curso ${data.courseTitle}:`,
        error.response?.data || error.message,
      );
    }
  }
}