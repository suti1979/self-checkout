import { TransactionData } from 'src/stock/entities/stock.entity';

export function calculateGiveBack(
  inserted: TransactionData,
  price: number,
  bank: TransactionData,
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

  const totalInserted = Object.keys(inserted).reduce((acc, key) => {
    if (validKeys.includes(key)) {
      return acc + parseInt(key) * inserted[key];
    } else {
      throw new Error(`Invalid banknote: ${key}`);
    }
  }, 0);

  if (totalInserted < price) {
    throw new Error('Insufficient funds');
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
    throw new Error('Not enough banknotes to give back the required amount');
  }

  return giveBackNotes;
}
