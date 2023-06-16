import { ApiProperty } from '@nestjs/swagger';
import { IsValidTransactionDataKeys } from '../../validators/IsValidTransactionDataKeys';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface TransactionData {
  [key: string]: number;
}

@Entity({ name: 'Transaction' })
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'json' })
  @IsValidTransactionDataKeys()
  @ApiProperty()
  data: TransactionData;
}
