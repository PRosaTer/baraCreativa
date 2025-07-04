import { IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaypalOrderDto {
  @IsNumber()
  @IsPositive()
  monto: number;

  @IsNotEmpty()
  @IsString()
  currency_code: string; 

  @IsNumber()
  @IsPositive()
  cursoId: number;
  
  @IsNumber()
  @IsPositive()
  usuarioId: number;
}
