import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

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

  @IsString()
  @IsNotEmpty({ message: 'El tipo de usuario es obligatorio' })
  tipoUsuario: string;

  @IsString()
  @IsOptional()
  nombreEmpresa?: string;

  @IsString()
  @IsOptional()
  fotoPerfil?: string;

  @IsString()
  @IsOptional()
  estadoCuenta?: string;
}
