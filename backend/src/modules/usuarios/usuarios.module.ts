import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { UsuariosController } from '../../controllers/usuarios/usuarios.controller';
import { UsuariosGateway } from '../../usuarios/usuarios.gateway';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosGateway, SocketGateway],
  exports: [UsuariosService],
})
export class UsuariosModule {}
