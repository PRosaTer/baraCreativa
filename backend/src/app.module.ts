import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { UsuariosModule } from './usuarios/usuarios.module';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { CursosModule } from './cursos/cursos.module';
import { PagosModule } from './pagos/pagos.module';

import configuration, { AppConfig } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('database.host', { infer: true }),
        port: config.get('database.port', { infer: true }),
        username: config.get('database.user', { infer: true }),
        password: config.get('database.password', { infer: true }),
        database: config.get('database.name', { infer: true }),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true, 
      }),
    }),
    UsuariosModule,
    PasswordModule,
    AuthModule,
    CursosModule,
    PagosModule,
  ],
})
export class AppModule {}