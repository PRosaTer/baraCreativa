import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs'; 

import { Pago } from '../entidades/pago.entity';
import { Curso } from '../entidades/curso.entity';
import { Usuario } from '../entidades/usuario.entity';
import { CreatePaypalOrderDto } from './dto/create-paypal-order.dto';
import { CapturePaypalOrderDto } from './dto/capture-paypal-order.dto';

import { 
  PayPalAccessTokenResponse,
  PayPalOrderResponse,
  PayPalCaptureResponse,
  PayPalLink
} from './interfaces/paypal.interface'; 


@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);
  private paypalApiBaseUrl: string;
  private paypalClientId: string;
  private paypalClientSecret: string;

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, 
  ) {

    this.paypalClientId = this.configService.get<string>('PAYPAL_CLIENT_ID')!;
    this.paypalClientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET')!;
    this.paypalApiBaseUrl = this.configService.get<string>('PAYPAL_API_BASE_URL')!;

    if (!this.paypalClientId || !this.paypalClientSecret || !this.paypalApiBaseUrl) {
      const missingVars: string[] = [];
      
      if (!this.paypalClientId) missingVars.push('PAYPAL_CLIENT_ID');
      if (!this.paypalClientSecret) missingVars.push('PAYPAL_CLIENT_SECRET');
      if (!this.paypalApiBaseUrl) missingVars.push('PAYPAL_API_BASE_URL');

      this.logger.error(`Faltan las siguientes variables de entorno de PayPal: ${missingVars.join(', ')}.`);
      throw new Error('Las credenciales de PayPal no están configuradas correctamente. Verifique su archivo .env');
    }
  }

  private async getPaypalAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.paypalClientId}:${this.paypalClientSecret}`).toString('base64');

      const observable$ = this.httpService.post<PayPalAccessTokenResponse>(
        `${this.paypalApiBaseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`,
          },
        },
      );

      const response = await lastValueFrom(observable$);

      if (!response.data || !response.data.access_token) {
        throw new InternalServerErrorException('No se recibió un token de acceso válido de PayPal.');
      }
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Error al obtener el token de PayPal', error.response?.data || error.message);
      throw new InternalServerErrorException('Error al comunicarse con PayPal para autenticación.');
    }
  }

  async createPaypalOrder(createOrderDto: CreatePaypalOrderDto) {
    this.logger.log(`Intentando crear orden de PayPal para monto: ${createOrderDto.monto}`);

    const curso = await this.cursoRepository.findOne({ where: { id: createOrderDto.cursoId } });
    const usuario = await this.usuarioRepository.findOne({ where: { id: createOrderDto.usuarioId } });

    if (!curso) throw new BadRequestException(`Curso con ID ${createOrderDto.cursoId} no encontrado.`);
    if (!usuario) throw new BadRequestException(`Usuario con ID ${createOrderDto.usuarioId} no encontrado.`);

    if (curso.precio !== createOrderDto.monto) {
      this.logger.warn(`Monto proporcionado (${createOrderDto.monto}) no coincide con precio del curso (${curso.precio}). Se usará el precio del curso.`);
      createOrderDto.monto = Number(curso.precio);
    }

    try {
      const accessToken = await this.getPaypalAccessToken();
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: createOrderDto.currency_code,
              value: createOrderDto.monto.toFixed(2),
            },
            description: `Compra del curso: ${curso.titulo}`,
          },
        ],
        application_context: {
          return_url: 'http://localhost:3000/success-paypal',
          cancel_url: 'http://localhost:3000/cancel-paypal',
          brand_name: 'BaraCreativa',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      };

      const observable$ = this.httpService.post<PayPalOrderResponse>(
        `${this.paypalApiBaseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Prefer': 'return=representation',
          },
        },
      );

      const response = await lastValueFrom(observable$);

      if (!response || !response.data) {
          throw new InternalServerErrorException('No se recibió una respuesta válida al crear la orden de PayPal.');
      }

      const approveLink = response.data.links.find(link => link.rel === 'approve');
      if (!approveLink) {
        throw new InternalServerErrorException('No se encontró el enlace de aprobación de PayPal.');
      }

      const newPago = this.pagoRepository.create({
        monto: createOrderDto.monto,
        metodoPago: 'PayPal',
        usuario,
        curso,
        referenciaPago: response.data.id,
      });

      await this.pagoRepository.save(newPago);

      return {
        orderId: response.data.id,
        approveUrl: approveLink.href,
        status: response.data.status,
      };

    } catch (error) {
      this.logger.error('Error al crear la orden de PayPal:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        throw new InternalServerErrorException(`No se pudo crear la orden de PayPal: ${JSON.stringify(error.response.data)}`);
      }
      throw new InternalServerErrorException('No se pudo crear la orden de PayPal debido a un error desconocido.');
    }
  }

  async capturePaypalOrder(captureOrderDto: CapturePaypalOrderDto) {
    this.logger.log(`Intentando capturar orden de PayPal con ID: ${captureOrderDto.orderId}`);

    try {
      const accessToken = await this.getPaypalAccessToken();
      const observable$ = this.httpService.post<PayPalOrderResponse>(
        `${this.paypalApiBaseUrl}/v2/checkout/orders/${captureOrderDto.orderId}/capture`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );

      const response = await lastValueFrom(observable$);

      if (!response || !response.data) {
          throw new InternalServerErrorException('No se recibió una respuesta válida al capturar la orden de PayPal.');
      }

      const paypalOrder = response.data;
      this.logger.log(`Orden de PayPal capturada: ${paypalOrder.id}, Estado: ${paypalOrder.status}`);

      if (paypalOrder.status === 'COMPLETED') {
        const pagoExistente = await this.pagoRepository.findOne({ 
          where: { referenciaPago: paypalOrder.id },
          relations: ['usuario', 'curso'],
        });

        if (pagoExistente) {
          pagoExistente.fechaConfirmacionPago = new Date();
          await this.pagoRepository.save(pagoExistente);

          const captureDetails = paypalOrder.purchase_units[0]?.payments?.captures?.[0] || {};

          return {
            status: 'COMPLETED',
            paymentId: paypalOrder.id,
            transactionDetails: captureDetails,
            pagoLocal: pagoExistente,
          };
        } else {
          this.logger.warn(`Pago con referencia ${paypalOrder.id} no encontrado en DB para actualizar.`);
          throw new InternalServerErrorException('Pago no encontrado en DB para actualizar.');
        }
      } else {
        this.logger.warn(`Orden de PayPal no completada. Estado: ${paypalOrder.status}`);
        throw new BadRequestException(`La orden de PayPal no se completó. Estado: ${paypalOrder.status}`);
      }

    } catch (error) {
      this.logger.error('Error al capturar la orden de PayPal:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        throw new InternalServerErrorException(`No se pudo capturar la orden de PayPal: ${JSON.stringify(error.response.data)}`);
      }
      throw new InternalServerErrorException('No se pudo capturar la orden de PayPal debido a un error desconocido.');
    }
  }
}