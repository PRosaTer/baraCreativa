// main.ts (NestJS)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000' }); // Ajusta según tu frontend
  await app.listen(3001);
}
bootstrap();
