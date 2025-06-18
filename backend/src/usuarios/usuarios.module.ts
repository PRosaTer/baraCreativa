// usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosService],
  exports: [UsuariosService], // 👈 NECESARIO
})
export class UsuariosModule {}
