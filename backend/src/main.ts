import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });

  app.use(cookieParser());

  // Crear carpeta uploads/imagenes-cursos si no existe
  const uploadPath = join(process.cwd(), 'uploads', 'imagenes-cursos');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`✔️ Carpeta creada: ${uploadPath}`);
  }

  // Servir archivos estáticos desde la carpeta 'uploads'
  // Esto hace que las imágenes guardadas sean accesibles vía http://localhost:3001/uploads/...
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3001); // Asegúrate que tu backend corra en este puerto
  console.log('🚀 Backend corriendo en http://localhost:3001');
}
bootstrap();