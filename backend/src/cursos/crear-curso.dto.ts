import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuloDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  pdfUrl?: string;
}

export class CrearCursoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsIn(['Docentes', 'Empresas'])
  tipo: 'Docentes' | 'Empresas';

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  duracionHoras: number;

  @IsNumber()
  precio: number;

  @IsIn(['en vivo', 'grabado', 'mixto'])
  modalidad: 'en vivo' | 'grabado' | 'mixto';

  @IsBoolean()
  certificadoDisponible: boolean;

  @IsBoolean()
  badgeDisponible: boolean;

  @IsOptional()
  @IsString()
  imagenCurso?: string;

  @IsOptional()
  @IsString()
  archivoCurso?: string;


  @IsOptional()
  @IsArray() 
  @ValidateNested({ each: true })
  @Type(() => ModuloDto)
  modulos?: ModuloDto[];
}