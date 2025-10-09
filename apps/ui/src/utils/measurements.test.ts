import { fractionToNumber, numberToFraction } from './measurements';

describe('measurements', () => {
  it.each([[0.5, 0.33, 0.1, 0, 1.33]])('numberToFraction', (input: number) => {
    expect(fractionToNumber(numberToFraction(input))).toBe(input);
  });

  it.each([['1/2', '1/3', '1/10', '0', '1 1/3']])(
    'fractionToNumber',
    (input: string) => {
      expect(numberToFraction(fractionToNumber(input))).toBe(input);
    },
  );
});
