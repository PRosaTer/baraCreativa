import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { InscripcionesService } from '../inscripciones/inscripciones.service';
import { MailService } from '../mail/mail.service';

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
    private readonly inscripcionesService: InscripcionesService,
    private readonly mailService: MailService,
  ) {
    this.paypalClientId = this.configService.get<string>('PAYPAL_CLIENT_ID')!;
    this.paypalClientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET')!;
    this.paypalApiBaseUrl = this.configService.get<string>('PAYPAL_API_BASE_URL')!;

    if (!this.paypalClientId || !this.paypalClientSecret || !this.paypalApiBaseUrl) {
      this.logger.error('Faltan variables de entorno para PayPal');
      throw new Error('Credenciales de PayPal no configuradas correctamente.');
    }
  }

  private async getPaypalAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.paypalClientId}:${this.paypalClientSecret}`).toString('base64');
    const observable$ = this.httpService.post(
      `${this.paypalApiBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
      },
    );
    const response = await lastValueFrom(observable$);
    if (!response.data?.access_token) {
      this.logger.error('No se recibió token válido de PayPal');
      throw new InternalServerErrorException('Token inválido de PayPal');
    }
    return response.data.access_token;
  }

  async createPaypalOrder(createOrderDto: CreatePaypalOrderDto) {
    const curso = await this.cursoRepository.findOneBy({ id: createOrderDto.cursoId });
    const usuario = await this.usuarioRepository.findOneBy({ id: createOrderDto.usuarioId });

    if (!curso) throw new BadRequestException(`Curso ID ${createOrderDto.cursoId} no encontrado`);
    if (!usuario) throw new BadRequestException(`Usuario ID ${createOrderDto.usuarioId} no encontrado`);

    const monto = Number(curso.precio);
    const accessToken = await this.getPaypalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: createOrderDto.currency_code,
            value: monto.toFixed(2),
          },
          description: `Compra curso: ${curso.titulo}`,
        },
      ],
      application_context: {
        brand_name: 'BaraCreativa',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'http://localhost:3000/success-paypal',
        cancel_url: 'http://localhost:3000/cancel-paypal',
        shipping_preference: 'NO_SHIPPING',
      },
    };

    const observable$ = this.httpService.post(
      `${this.paypalApiBaseUrl}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'return=representation',
        },
      },
    );
    const response = await lastValueFrom(observable$);

    if (!response.data) {
      throw new InternalServerErrorException('Respuesta inválida de PayPal al crear orden');
    }

    const approveLink = response.data.links.find((link: { rel: string }) => link.rel === 'approve');
    if (!approveLink) {
      throw new InternalServerErrorException('No se encontró enlace de aprobación en PayPal');
    }

    const nuevoPago = this.pagoRepository.create({
      monto,
      metodoPago: 'PayPal',
      usuario,
      curso,
      referenciaPago: response.data.id,
    });

    await this.pagoRepository.save(nuevoPago);

    return {
      orderId: response.data.id,
      approveUrl: approveLink.href,
      status: response.data.status,
    };
  }

  async capturePaypalOrder(captureOrderDto: CapturePaypalOrderDto) {
    const accessToken = await this.getPaypalAccessToken();

    const observable$ = this.httpService.post(
      `${this.paypalApiBaseUrl}/v2/checkout/orders/${captureOrderDto.orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const response = await lastValueFrom(observable$);

    if (!response.data) {
      throw new InternalServerErrorException('Respuesta inválida de PayPal al capturar orden');
    }

    const paypalOrder = response.data;

    if (paypalOrder.status !== 'COMPLETED') {
      throw new BadRequestException(`Orden no completada. Estado: ${paypalOrder.status}`);
    }

    const pagoExistente = await this.pagoRepository.findOne({
      where: { referenciaPago: paypalOrder.id },
      relations: ['usuario', 'curso'],
    });

    if (!pagoExistente) {
      throw new InternalServerErrorException('Pago no encontrado para actualizar');
    }

    pagoExistente.fechaConfirmacionPago = new Date();
    await this.pagoRepository.save(pagoExistente);

    const inscripcionExistente = await this.inscripcionesService.findByUserAndCourse(
      pagoExistente.usuario.id,
      pagoExistente.curso.id,
    );

    if (!inscripcionExistente) {
      await this.inscripcionesService.createInscripcion(pagoExistente.usuario, pagoExistente.curso, 'Pagado');
    } else if (inscripcionExistente.estado === 'Pendiente') {
      await this.inscripcionesService.updateInscripcionEstado(inscripcionExistente.id, 'Pagado');
    }

    const captureDetails = paypalOrder.purchase_units[0]?.payments?.captures?.[0];


    await this.mailService.sendPurchaseReceiptToCustomer(
      pagoExistente.usuario.correoElectronico,
      pagoExistente.usuario.nombreCompleto,
      pagoExistente.curso.titulo,
      pagoExistente.monto,
      paypalOrder.id,
      {
        id: captureDetails.id,
        create_time: captureDetails.create_time,
        amount: captureDetails.amount,
      },
    );

    return {
      userEmail: pagoExistente.usuario.correoElectronico,
      userName: pagoExistente.usuario.nombreCompleto,
      courseTitle: pagoExistente.curso.titulo,
      paymentAmount: pagoExistente.monto,
      orderId: paypalOrder.id,
      transactionDetails: {
        id: captureDetails.id,
        create_time: captureDetails.create_time,
        amount: captureDetails.amount,
      },
    };
  }
}
