import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/entidades/usuario.entity';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
