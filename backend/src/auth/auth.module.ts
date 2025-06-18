// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './estrategias/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from '../usuarios/usuarios.module'; // 👈 Asegurate de importar esto
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    UsuariosModule, // 👈 Agregado acá
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 Asegurate de que AuthService esté acá también
  exports: [JwtStrategy],
})
export class AuthModule {}
