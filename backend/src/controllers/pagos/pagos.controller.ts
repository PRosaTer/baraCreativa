import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from '../../services/pagos/pagos.service';
import { CreatePaypalOrderDto } from '../../dto/pagos/create-paypal-order.dto';
import { CapturePaypalOrderDto } from '../../dto/pagos/capture-paypal-order.dto';

@Controller('pagos/paypal')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreatePaypalOrderDto) {
    return this.pagosService.createPaypalOrder(createOrderDto);
  }

  @Post('capture-order')
  async captureOrder(@Body() captureOrderDto: CapturePaypalOrderDto) {
    const result = await this.pagosService.capturePaypalOrder(captureOrderDto);
    return { message: 'Pago capturado correctamente', status: result.status };
  }
}
