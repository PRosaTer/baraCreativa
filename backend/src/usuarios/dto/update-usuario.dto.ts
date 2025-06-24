import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['tipoUsuario'] as const),
) {
  @IsOptional()
  @IsDate()
  ultimaSesion?: Date;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
