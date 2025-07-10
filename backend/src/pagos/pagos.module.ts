import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from '../entidades/pago.entity';
import { Curso } from '../entidades/curso.entity';
import { Usuario } from '../entidades/usuario.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { InscripcionesModule } from '../inscripciones/inscripciones.module';
import { MailModule } from '../mail/mail.module'; 
import { PurchaseMailService } from '../mail/purchase-mail.service';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Curso, Usuario]),
    HttpModule,
    ConfigModule,
    InscripcionesModule,
    MailModule,
    UsuariosModule,
  ],
  providers: [PagosService, PurchaseMailService],
  controllers: [PagosController],
})
export class PagosModule {}
