import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../entidades/usuario.entity';
import { UsuariosController } from '../../controllers/usuarios/usuarios.controller';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => SocketModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, SocketGateway],
  exports: [UsuariosService, JwtModule, SocketGateway],
})
export class UsuariosModule {}


@Module({
  imports: [forwardRef(() => UsuariosModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
