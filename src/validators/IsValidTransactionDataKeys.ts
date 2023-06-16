import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidTransactionDataKeys(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidTransactionDataKeys',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object') {
            return false;
          }

          const keys = Object.keys(value);

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
          const isValid = keys.every((key) => validKeys.includes(key));

          return isValid;
        },
      },
    });
  };
}
