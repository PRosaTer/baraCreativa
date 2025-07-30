import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class MarcarModuloCompletadoDto {
  @ApiProperty({ description: 'ID del curso al que pertenece el módulo', example: 117 })
  @IsNumber()
  @IsNotEmpty()
  moduloId: number;

  @ApiProperty({ description: 'ID del curso al que pertenece el módulo', example: 117 })
  @IsNumber()
  @IsNotEmpty()
  cursoId: number;
}

export interface EstadoModuloUsuario {
  id: number;
  titulo: string;
  tipo: 'scorm' | 'video' | 'pdf' | 'imagen' | 'texto';
  orden: number | null;
  videoUrls?: string[] | null;
  pdfUrls?: string[] | null;
  imageUrls?: string[] | null;
  urlContenido?: string | null;
  descripcionContenido?: string | null;
  completado: boolean;
  fechaCompletado: Date | null;
}
