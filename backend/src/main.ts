import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { promises as fsPromises } from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function createFolderIfNotExist(path: string) {
  try {
    await fsPromises.mkdir(path, { recursive: true });
  } catch (err) {
    console.error(`Error creando carpeta ${path}:`, err);
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');


  app.enableCors({
    origin: /https:\/\/(.*\.)?onrender\.com$/,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
 

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const uploadPath = join(process.cwd(), 'uploads', 'imagenes-cursos');
  const scormUploadPath = join(process.cwd(), 'uploads', 'scorm');
  const scormUnzippedPath = join(process.cwd(), 'uploads', 'scorm_unzipped_courses');
  const scormTempPath = join(process.cwd(), 'uploads', 'scorm_temp');

  await Promise.all([
    createFolderIfNotExist(uploadPath),
    createFolderIfNotExist(scormUploadPath),
    createFolderIfNotExist(scormUnzippedPath),
    createFolderIfNotExist(scormTempPath),
  ]);

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use('/scorm_courses', express.static(scormUnzippedPath)); 

  const config = new DocumentBuilder()
    .setTitle('API Bara Creativa')
    .setDescription('Documentación de la API para pagos, cursos y usuarios')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
