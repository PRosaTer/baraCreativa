import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePaypalOrderDto } from './dto/create-paypal-order.dto';
import { CapturePaypalOrderDto } from './dto/capture-paypal-order.dto';

@Controller('pagos/paypal')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreatePaypalOrderDto) {
    return this.pagosService.createPaypalOrder(createOrderDto);
  }

  @Post('capture-order')
  async captureOrder(@Body() captureOrderDto: CapturePaypalOrderDto) {
    return this.pagosService.capturePaypalOrder(captureOrderDto);
  }
}
