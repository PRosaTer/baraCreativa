// src/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller'; // <-- IMPORTANTE

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController], // <-- AÑADÍ ESTO
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
