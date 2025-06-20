import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { TipoUsuario, EstadoCuenta } from '../../entidades/usuario.entity';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombreCompleto: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  correoElectronico: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEnum(TipoUsuario, { message: 'Tipo de usuario inválido' })
  @IsNotEmpty({ message: 'El tipo de usuario es obligatorio' })
  tipoUsuario: TipoUsuario;

  @IsString()
  @IsOptional()
  nombreEmpresa?: string;

  @IsString()
  @IsOptional()
  fotoPerfil?: string;

  @IsEnum(EstadoCuenta, { message: 'Estado de cuenta inválido' })
  @IsOptional()
  estadoCuenta?: EstadoCuenta;

}