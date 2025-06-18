import * as nodemailer from 'nodemailer'; 

import { ConfigService } from '@nestjs/config';

export function crearTransportador(configService: ConfigService) {
  return nodemailer.createTransport({
    host: configService.get('EMAIL_HOST'),
    port: configService.get('EMAIL_PORT'),
    secure: false, 
    auth: {
      user: configService.get('EMAIL_USER'),
      pass: configService.get('EMAIL_PASS'),
    },
  });
}
