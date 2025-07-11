import { IsString, IsNotEmpty } from 'class-validator';

export class CapturePaypalOrderDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
