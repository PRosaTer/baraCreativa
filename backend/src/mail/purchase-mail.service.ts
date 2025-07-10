import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface TransactionDetails {
  id: string;
  create_time?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
}

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

  async sendPurchaseReceiptToCustomer(
    customerEmail: string,
    customerName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ) {
    try {
      await this.mailerService.sendMail({
        from: `BaraCreativa <${this.senderEmail}>`,
        to: customerEmail,
        subject: `Boleta de compra - Curso: ${courseTitle}`,
        template: 'custom-purchase-receipt',
        context: {
          customerName,
          courseTitle,
          paymentAmount: paymentAmount.toFixed(2),
          orderId,
          transactionId: transactionDetails.id,
          currency: transactionDetails.amount?.currency_code,
          captureTime: new Date(transactionDetails.create_time || Date.now()).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Boleta de compra enviada a: ${customerEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando boleta al cliente ${customerEmail}:`, error.response?.data || error.message);
    }
  }
}
