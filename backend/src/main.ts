import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());


  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));


  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
  console.log('🚀 Backend corriendo en http://localhost:3001');
}
bootstrap();
