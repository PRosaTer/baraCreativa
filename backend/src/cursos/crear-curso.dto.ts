import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';


export enum TipoCurso {
  DOCENTES = 'Docentes',
  ESTUDIANTES = 'Estudiantes',
  EMPRESAS = 'Empresas',
}

export enum ModalidadCurso {
  EN_VIVO = 'en vivo',
  GRABADO = 'grabado',
  MIXTO = 'mixto',
}

export class ModuloDto {
  @IsOptional()
  @IsNumber()
  id?: number;

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

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
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

  @IsEnum(TipoCurso)
  tipo: TipoCurso;

  @IsString()
  categoria: string;

  @IsEnum(ModalidadCurso)
  modalidad: ModalidadCurso;

  @IsBoolean()
  certificadoDisponible: boolean;

  @IsBoolean()
  badgeDisponible: boolean;

  @IsOptional()
  @IsString()
  imagenCurso?: string | null;

  @IsOptional()
  @IsString()
  archivoScorm?: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  @IsArray()
  modulos?: ModuloDto[];
}
