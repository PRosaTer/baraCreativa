import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePaypalOrderDto } from './dto/create-paypal-order.dto';
import { CapturePaypalOrderDto } from './dto/capture-paypal-order.dto';
import { MailService } from '../mail/mail.service';

@Controller('pagos/paypal')
export class PagosController {
  constructor(
    private readonly pagosService: PagosService,
    private readonly mailService: MailService,
  ) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreatePaypalOrderDto) {
    return this.pagosService.createPaypalOrder(createOrderDto);
  }

  @Post('capture-order')
  async captureOrder(@Body() captureOrderDto: CapturePaypalOrderDto) {
    const { userEmail, userName, courseTitle, paymentAmount, orderId, transactionDetails } =
      await this.pagosService.capturePaypalOrder(captureOrderDto);

    await this.mailService.sendPurchaseReceiptToCustomer(
      userEmail,
      userName,
      courseTitle,
      paymentAmount,
      orderId,
      transactionDetails,
    );

    return { message: 'Pago capturado y boleta enviada' };
  }
}
