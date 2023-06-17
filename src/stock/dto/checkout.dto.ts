import { ApiProperty } from '@nestjs/swagger';
import { Stock } from '../entities/stock.entity';

export class CheckoutDto {
  @ApiProperty()
  readonly inserted: Stock;

  @ApiProperty()
  readonly price: number;
}
