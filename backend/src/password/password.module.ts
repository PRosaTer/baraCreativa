import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { Usuario } from 'src/entidades/usuario.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), ConfigModule],
  providers: [PasswordService],
  controllers: [PasswordController],
})
export class PasswordModule {}
