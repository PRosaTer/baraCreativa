import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/entidades/usuario.entity';
import { PasswordController } from '../../controllers/password/password.controller';
import { PasswordService } from '../../services/password/password.service'; // Mismo error aquí.

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
