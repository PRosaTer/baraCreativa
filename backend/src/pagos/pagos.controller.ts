import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Res, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePaypalOrderDto } from './dto/create-paypal-order.dto';
import { CapturePaypalOrderDto } from './dto/capture-paypal-order.dto';
import { Response } from 'express';

@Controller('pagos/paypal')
export class PagosController {
  private readonly logger = new Logger(PagosController.name);

  constructor(private readonly pagosService: PagosService) {}

  @Post('create-order')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() createOrderDto: CreatePaypalOrderDto) {
    this.logger.log('Recibida solicitud para crear orden de PayPal');
    return this.pagosService.createPaypalOrder(createOrderDto);
  }

  @Post('capture-order')
  @HttpCode(HttpStatus.OK)
  async captureOrder(@Body() captureOrderDto: CapturePaypalOrderDto) {
    this.logger.log(`Recibida solicitud para capturar orden de PayPal con ID: ${captureOrderDto.orderId}`);
    return this.pagosService.capturePaypalOrder(captureOrderDto);
  }


  @Get('success')
  async paypalSuccess(@Query('token') token: string, @Query('PayerID') payerId: string, @Res() res: Response) {
    this.logger.log(`PayPal Success Callback - Token: ${token}, PayerID: ${payerId}`);
    
    if (!token) {
      throw new BadRequestException('Falta el token de la orden de PayPal.');
    }

    try {
      const result = await this.pagosService.capturePaypalOrder({ orderId: token });
      
      if (result.status === 'COMPLETED') {
        this.logger.log(`Pago ${token} COMPLETADO. Redirigiendo a página de éxito.`);
        return res.redirect('http://localhost:3000/pago-exitoso');
      } else {
        this.logger.error(`Pago ${token} no completado. Estado: ${result.status}.`);
        return res.redirect('http://localhost:3000/pago-fallido');
      }

    } catch (error) {
      this.logger.error('Error al procesar la captura en PayPal Success:', error.response?.data || error.message);
      return res.redirect('http://localhost:3000/pago-fallido');
    }
  }


  @Get('cancel')
  async paypalCancel(@Query('token') token: string, @Res() res: Response) {
    this.logger.warn(`PayPal Cancel Callback - Token: ${token}. El usuario canceló el pago.`);
    return res.redirect('http://localhost:3000/pago-cancelado');
  }
}