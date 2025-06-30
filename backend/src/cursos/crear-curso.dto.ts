import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ModuloDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  videoUrl?: string | null;

  @IsOptional()
  @IsString()
  pdfUrl?: string | null;
}

export class CrearCursoDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsNumber()
  duracionHoras: number;

  @IsString()
  tipo: 'Docentes' | 'Empresas';

  @IsString()
  categoria: string;

  @IsString()
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @IsBoolean()
  certificadoDisponible: boolean;

  @IsBoolean()
  badgeDisponible: boolean;

  @IsOptional()
  @IsString()
  imagenCurso?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  @IsArray()
  modulos?: ModuloDto[];
}
