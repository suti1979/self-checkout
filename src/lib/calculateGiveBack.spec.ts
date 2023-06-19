import { TransactionData } from 'src/stock/entities/stock.entity';
import { calculateGiveBack } from './calculateGiveBack';

describe('calculateGiveBack', () => {
  it('should calculate give back correctly when there are enough banknotes', () => {
    const inserted: TransactionData = {
      '100': 2,
      '200': 1,
    };
    const price = 350;
    const bank: TransactionData = {
      '50': 10,
      '200': 5,
      '500': 2,
    };

    const giveBack = calculateGiveBack(inserted, price, bank, null);

    expect(giveBack).toEqual({
      '50': 1,
    });
  });

  it('should throw an error when there are not enough banknotes', () => {
    const inserted: TransactionData = {
      '100': 1,
      '200': 1,
    };
    const price = 350;
    const bank: TransactionData = {
      '100': 1,
      '200': 1,
    };

    expect(() => calculateGiveBack(inserted, price, bank, null)).toThrowError(
      'Not enough banknotes inserted',
    );
  });

  it('should throw an error when total inserted is less than the price', () => {
    const inserted: TransactionData = {
      '200': 3,
    };
    const price = 500;
    const bank: TransactionData = {
      '500': 2,
    };

    expect(() => calculateGiveBack(inserted, price, bank, null)).toThrowError(
      'Not enough banknotes to give back the required amount',
    );
  });

  it('should throw an error when an invalid banknote is inserted', () => {
    const inserted: TransactionData = {
      '51': 2, // Invalid banknote
      '100': 1,
    };
    const price = 350;
    const bank: TransactionData = {
      '100': 10,
      '200': 5,
      '500': 2,
    };

    expect(() => calculateGiveBack(inserted, price, bank, null)).toThrowError(
      'Invalid banknote: 51',
    );
  });
});
