import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsDate, IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoUsuario } from '../../entidades/usuario.entity';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsDate()
  ultimaSesion?: Date;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(TipoUsuario)
  tipoUsuario?: TipoUsuario; 
}
