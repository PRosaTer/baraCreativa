import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../../services/password/password.service';
import { PasswordController } from '../../controllers/password/password.controller';
import { Usuario } from 'src/entidades/usuario.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),  // Registro del repositorio Usuario
    ConfigModule,                         // Para inyectar ConfigService
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
