import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { TransactionDetails } from '../../interfaces/transaction-details.interface';

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
  private transporter: nodemailer.Transporter;
  private readonly adminEmail: string;

  constructor() {
    this.adminEmail = process.env.EMAIL_USER ?? 'admin@default.com';

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async renderTemplate<T extends object>(templateName: string, variables: T): Promise<string> {
    const filePath = path.resolve(__dirname, 'templates', `${templateName}.hbs`);
    const templateContent = await fs.promises.readFile(filePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(variables);
  }

  async sendPurchaseReceiptToCustomer(
    userEmail: string,
    userName: string,
    courseTitle: string,
    paymentAmount: number,
    orderId: string,
    transactionDetails: TransactionDetails,
  ): Promise<void> {
    const html = await this.renderTemplate('purchase-receipt-user', {
      customerName: userName,
      courseTitle,
      paymentAmount,
      orderId,
      transactionId: transactionDetails?.id ?? '',
      captureTime: transactionDetails?.create_time ?? '',
      currency: 'USD', // O lo que uses
      currentYear: new Date().getFullYear(),
    });

    const mailOptions = {
      from: this.adminEmail,
      to: userEmail,
      subject: `Gracias por tu compra, ${userName}!`,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPurchaseNotificationToAdmin(data: PurchaseNotificationData): Promise<void> {
    const {
      userName,
      userEmail,
      courseTitle,
      paymentAmount,
      orderId,
      transactionDetails,
      tipoUsuario,
      cursosComprados,
      totalComprados,
      porcentajeComprados,
    } = data;

    const html = await this.renderTemplate('admin-purchase-notification', {
      userName,
      userEmail,
      courseTitle,
      paymentAmount,
      orderId,
      transactionId: transactionDetails?.id ?? '',
      purchaseDate: transactionDetails?.create_time ?? '',
      tipoUsuario,
      listaCursos: cursosComprados,
      totalCursosComprados: totalComprados,
      porcentajeCursosComprados: porcentajeComprados.toFixed(2),
      currentYear: new Date().getFullYear(),
    });

    const mailOptions = {
      from: this.adminEmail,
      to: this.adminEmail,
      subject: `Nueva compra realizada por ${userName}`,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordRecoveryEmailToUser(
    userEmail: string,
    userName: string,
    recoveryCode: string,
    resetUrl: string,
  ): Promise<void> {
    const html = await this.renderTemplate('password-recovery-user', {
      userName,
      recoveryCode,
      resetUrl,
      currentYear: new Date().getFullYear(),
    });

    const mailOptions = {
      from: this.adminEmail,
      to: userEmail,
      subject: 'Recuperación de contraseña',
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

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

    const mailOptions = {
      from: this.adminEmail,
      to: adminEmail,
      subject: 'Notificación de recuperación de contraseña',
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
