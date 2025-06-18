import { IsEmail, IsNotEmpty } from 'class-validator';

export class SolicitarResetDto {
  @IsEmail()
  @IsNotEmpty()
  correoElectronico: string;
}
