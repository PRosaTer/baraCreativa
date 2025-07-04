import { IsNotEmpty, IsString } from 'class-validator';

export class CapturePaypalOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
