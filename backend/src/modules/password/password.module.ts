import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '../../services/password/password.service';
import { PasswordController } from '../../controllers/password/password.controller';
import { Usuario } from 'src/entidades/usuario.entity';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ConfigModule,
    MailModule, 
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
