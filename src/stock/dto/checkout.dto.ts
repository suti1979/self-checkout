import { ApiProperty } from '@nestjs/swagger';
import { TransactionData } from '../entities/stock.entity';

export class CheckoutDto {
  @ApiProperty()
  readonly inserted: TransactionData;

  @ApiProperty()
  readonly price: number;
}
