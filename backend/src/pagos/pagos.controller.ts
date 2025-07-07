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

  /**
   * Maneja el callback de éxito de PayPal.
   * Si el pago se completa, redirige al usuario al contenido SCORM del curso si está disponible,
   * de lo contrario, redirige a una página de éxito general.
   * Si el pago no se completa o hay un error, redirige a una página de fallo.
   * @param token El token de la orden de PayPal.
   * @param payerId El ID del pagador de PayPal (opcional, puede no estar presente en todas las redirecciones).
   * @param res Objeto de respuesta de Express para manejar la redirección.
   */
  @Get('success')
  async paypalSuccess(@Query('token') token: string, @Query('PayerID') payerId: string, @Res() res: Response) {
    this.logger.log(`PayPal Success Callback - Token: ${token}, PayerID: ${payerId}`);
    
    if (!token) {
      throw new BadRequestException('Falta el token de la orden de PayPal.');
    }

    try {
      const result = await this.pagosService.capturePaypalOrder({ orderId: token });
      

      if (result.status === 'COMPLETED') {
        this.logger.log(`Pago ${token} COMPLETADO.`);
        
    
        if (result.pagoLocal && result.pagoLocal.curso && result.pagoLocal.curso.archivoScorm) {
          const scormUrl = result.pagoLocal.curso.archivoScorm;
          // Construye la URL completa del SCORM (asumiendo que es relativa a la base del frontend)
          // Asegúrate de que esta URL sea accesible desde el navegador del cliente
          const fullScormUrl = `http://localhost:3000${scormUrl}`; 
          this.logger.log(`Redirigiendo a contenido SCORM: ${fullScormUrl}`);
          return res.redirect(fullScormUrl); 
        } else {
          this.logger.log(`No se encontró URL SCORM para el curso asociado al pago ${token}. Redirigiendo a página de éxito general.`);
          return res.redirect('http://localhost:3000/pago-exitoso');
        }
      } else {
        this.logger.error(`Pago ${token} no completado. Estado: ${result.status}. Redirigiendo a página de fallo.`);
        return res.redirect('http://localhost:3000/pago-fallido');
      }

    } catch (error) {
      this.logger.error('Error al procesar la captura en PayPal Success:', error.response?.data || error.message);
      return res.redirect('http://localhost:3000/pago-fallido');
    }
  }

  /**
   * Maneja el callback de cancelación de PayPal.
   * Redirige al usuario a una página de pago cancelado.
   * @param token El token de la orden de PayPal.
   * @param res Objeto de respuesta de Express para manejar la redirección.
   */
  @Get('cancel')
  async paypalCancel(@Query('token') token: string, @Res() res: Response) {
    this.logger.warn(`PayPal Cancel Callback - Token: ${token}. El usuario canceló el pago.`);
    return res.redirect('http://localhost:3000/pago-cancelado');
  }
}
