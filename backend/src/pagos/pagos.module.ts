import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; 
import { ConfigModule } from '@nestjs/config'; 

import { PagosService } from './pagos.service';
import { Pago } from '../entidades/pago.entity';
import { Curso } from '../entidades/curso.entity';
import { Usuario } from '../entidades/usuario.entity';
import { PagosController } from './pagos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago, Curso, Usuario]),
    HttpModule, 
    ConfigModule, 
  ],
  providers: [PagosService],
  controllers: [PagosController],
  exports: [PagosService], 
})
export class PagosModule {}