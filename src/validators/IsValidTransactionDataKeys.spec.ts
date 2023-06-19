import { validate } from 'class-validator';
import { IsValidTransactionDataKeys } from './IsValidTransactionDataKeys';

class TestClass {
  @IsValidTransactionDataKeys()
  transactionData: any;
}

describe('IsValidTransactionDataKeys', () => {
  it('should validate transaction data keys correctly', async () => {
    const instance = new TestClass();

    // Set the transactionData with valid keys
    instance.transactionData = {
      '10': 'value',
      '50': 'value',
      '1000': 'value',
    };

    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should invalidate transaction data keys with invalid keys', async () => {
    const instance = new TestClass();

    // Set the transactionData with an invalid key
    instance.transactionData = {
      '10': 'value',
      '50000': 'value',
    };

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('IsValidTransactionDataKeys', () => {
  it('should invalidate non-object values', async () => {
    const instance = new TestClass();

    // Set the transactionData to a non-object value (string in this case)
    instance.transactionData = 'invalid';

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate object values', async () => {
    const instance = new TestClass();

    // Set the transactionData to a valid object
    instance.transactionData = {
      '10': 'value',
      '50': 'value',
      '1000': 'value',
    };

    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });
});
