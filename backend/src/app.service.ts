import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    console.log('✅ Backend iniciado correctamente y conectado a la DB');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
