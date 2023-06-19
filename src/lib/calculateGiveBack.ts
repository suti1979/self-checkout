import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionData } from 'src/stock/entities/stock.entity';

export function calculateGiveBack(
  inserted: TransactionData,
  price: number,
  bank: TransactionData,
  eurHufValue: number | null,
): TransactionData {
  const validKeys = [
    '5',
    '10',
    '20',
    '50',
    '100',
    '200',
    '500',
    '1000',
    '2000',
    '5000',
    '10000',
    '20000',
  ];

  let totalInserted = Object.keys(inserted).reduce((acc, key) => {
    if (validKeys.includes(key)) {
      return acc + parseInt(key) * inserted[key];
    } else {
      throw new HttpException(`Invalid banknote: ${key}`, HttpStatus.BAD_REQUEST);
    }
  }, 0);

  if (eurHufValue) {
    totalInserted = Math.round((totalInserted * eurHufValue) / 5) * 5;
  }

  if (totalInserted < price) {
    throw new HttpException(`Not enough banknotes inserted`, HttpStatus.BAD_REQUEST);
  }

  const giveBackNotes: TransactionData = {};
  let giveBackMoney = totalInserted - price;

  for (const key of validKeys.reverse()) {
    if (giveBackMoney === 0) break;

    const noteValue = parseInt(key);
    const noteCount = Math.min(Math.floor(giveBackMoney / noteValue), bank[key] || 0);

    if (noteCount > 0) {
      giveBackNotes[key] = noteCount;
      giveBackMoney -= noteValue * noteCount;
    }
  }

  if (giveBackMoney > 0) {
    throw new HttpException(
      `Not enough banknotes to give back the required amount`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return giveBackNotes;
}
