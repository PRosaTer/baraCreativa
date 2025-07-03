import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(cookieParser());


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const uploadPath = join(process.cwd(), 'uploads', 'imagenes-cursos');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`✔️ Carpeta creada: ${uploadPath}`);
  }

  const scormUploadPath = join(process.cwd(), 'uploads', 'scorm');
  if (!fs.existsSync(scormUploadPath)) {
    fs.mkdirSync(scormUploadPath, { recursive: true });
    console.log(`✔️ Carpeta creada: ${scormUploadPath}`);
  }

  const scormUnzippedPath = join(process.cwd(), 'uploads', 'scorm_unzipped_courses');
  if (!fs.existsSync(scormUnzippedPath)) {
    fs.mkdirSync(scormUnzippedPath, { recursive: true });
    console.log(`✔️ Carpeta creada: ${scormUnzippedPath}`);
  }

  const scormTempPath = join(process.cwd(), 'uploads', 'scorm_temp');
  if (!fs.existsSync(scormTempPath)) {
    fs.mkdirSync(scormTempPath, { recursive: true });
    console.log(`✔️ Carpeta creada: ${scormTempPath}`);
  }

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use('/scorm_courses', express.static(scormUnzippedPath));

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001);
  console.log('🚀 Backend corriendo en http://localhost:3001');
}
bootstrap();
