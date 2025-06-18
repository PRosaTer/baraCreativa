import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export const crearTransportador = (config: ConfigService) => {
  return nodemailer.createTransport({
    host: config.get('EMAIL_HOST'),
    port: Number(config.get('EMAIL_PORT')),
    secure: false,
    auth: {
      user: config.get('EMAIL_USER'),
      pass: config.get('EMAIL_PASS'),
    },
  });
};
