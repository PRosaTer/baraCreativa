import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


export class SubirScormDto {
  @IsNotEmpty({ message: 'El ID del curso es requerido.' })
  @IsNumber({}, { message: 'El ID del curso debe ser un número válido.' })
  @Type(() => Number) 
  cursoId: number;
}
