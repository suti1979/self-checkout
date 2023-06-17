import { Stock } from 'src/stock/entities/stock.entity';

export function calculateGiveBack(inserted: Stock, price: number): { [key: string]: number } {
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

  const totalInserted = Object.entries(inserted).reduce(
    (acc, [key, value]) => acc + parseInt(key) * value,
    0,
  );

  if (totalInserted < price) {
    throw new Error('Insufficient funds');
  }

  const giveBack: { [key: string]: number } = {};
  let remaining = totalInserted - price;
  for (let i = validKeys.length - 1; i >= 0; i--) {
    const key = validKeys[i];
    const billValue = parseInt(key);
    if (remaining >= billValue) {
      const count = Math.floor(remaining / billValue);
      giveBack[key] = count;
      remaining -= count * billValue;
    }
  }

  return giveBack;
}
