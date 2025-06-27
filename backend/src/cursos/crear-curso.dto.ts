import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class ModuloDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  videoUrl?: string;

  @IsOptional()
  pdfUrl?: string;
}

export class CrearCursoDto {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsEnum(['Docentes', 'Empresas'])
  tipo: 'Docentes' | 'Empresas';

  @IsString()
  categoria: string;

  @IsNumber()
  duracionHoras: number;

  @IsNumber()
  precio: number;

  @IsEnum(['en vivo', 'grabado', 'mixto'])
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @IsBoolean()
  certificadoDisponible: boolean;

  @IsBoolean()
  badgeDisponible: boolean;

  @IsOptional()
  imagenCurso?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  modulos: ModuloDto[];
}
