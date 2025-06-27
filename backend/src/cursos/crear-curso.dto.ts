import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ModalidadCurso, TipoCurso } from '../entidades/curso.entity';

export class CrearCursoDto {
  @IsNotEmpty() @IsString()
  titulo: string;

  @IsNotEmpty() @IsString()
  descripcion: string;

  @IsEnum(TipoCurso)
  tipo: TipoCurso;

  @IsNotEmpty() @IsString()
  categoria: string;

  @IsNumber()
  duracionHoras: number;

  @IsNumber()
  precio: number;

  @IsEnum(ModalidadCurso)
  modalidad: ModalidadCurso;

  @IsOptional() @IsString()
  imagenCurso?: string;

  @IsBoolean()
  certificadoDisponible: boolean;

  @IsBoolean()
  badgeDisponible: boolean;
}