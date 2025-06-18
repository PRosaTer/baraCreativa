
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entidades/usuario.entity';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [PasswordService],
  controllers: [PasswordController],
})
export class PasswordModule {}
