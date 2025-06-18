import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarResetDto {
  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;
}
