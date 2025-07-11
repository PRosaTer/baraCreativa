import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaypalOrderDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  cursoId: number;

  @IsString()
  @IsNotEmpty()
  currency_code: string;
}
