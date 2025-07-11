import { IsNotEmpty, MinLength } from 'class-validator';

export class ConfirmarResetDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
