import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosGateway } from './usuarios.gateway';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosGateway, SocketGateway],
  exports: [UsuariosService],
})
export class UsuariosModule {}
