import { type CreateIngredientDto } from '@repo/codegen/model';
import { ingredientRowArraySchema } from '@src/zod-schemas';
import { type NormalizedIngredient } from '@src/zod-schemas/recipeNormalized';
import { z } from 'zod/v4';
import { fractionToNumber, type MeasurementUnitType } from './measurements';

/**
 * Positionally splits ingredient words into amount, unit, and name display parts.
 * This always produces display values regardless of validation.
 */
const splitIngredientWords = (
  words: string[],
): { amountDisplay: string; unitIndex: number } => {
  // If the second word contains '/' it's likely a fraction part (even invalid like "1/")
  if (words.length >= 2 && words[1]?.includes('/')) {
    return { amountDisplay: `${words[0]} ${words[1]}`, unitIndex: 2 };
  }
  return { amountDisplay: words[0] ?? '', unitIndex: 1 };
};

export const parseIngredientString = (input: string): NormalizedIngredient => {
  const words = input.trim().split(' ');
  const result = ingredientRowArraySchema.safeParse(words);

  if (result.success) {
    return result.data;
  }

  // Even on error, compute display values from the raw words
  const { amountDisplay, unitIndex } = splitIngredientWords(words);
  const unitDisplay = words[unitIndex] ?? '';
  const nameDisplay = words.slice(unitIndex + 1).join(' ');

  const errors = z.flattenError(result.error);

  return {
    amount: {
      value: NaN,
      display: amountDisplay,
      errors: errors.fieldErrors.amount,
    },
    isFraction: false,
    unit: {
      value: null,
      display: unitDisplay,
      errors: errors.fieldErrors.unit,
    },
    name: {
      value: nameDisplay,
      display: nameDisplay,
      errors: errors.fieldErrors.name,
    },
  };
};

export const emptyIngredient = (): NormalizedIngredient => ({
  amount: { value: NaN, display: '' },
  isFraction: false,
  unit: { value: null, display: '' },
  name: { value: '', display: '' },
});

export const ingredientDisplayString = (ing: NormalizedIngredient): string =>
  `${ing.amount.display} ${ing.unit.display} ${ing.name.display}`.trim();

export const toCreateIngredientDto = (
  ing: NormalizedIngredient,
): CreateIngredientDto => ({
  amount: ing.amount.value,
  isFraction: ing.isFraction,
  unit: ing.unit.value,
  name: ing.name.value,
});

export const hasIngredientErrors = (ing: NormalizedIngredient): boolean =>
  Boolean(
    ing.amount.errors?.length ??
      ing.unit.errors?.length ??
      ing.name.errors?.length,
  );

export const updateIngredientAmountField = (
  amount: string,
  ing: NormalizedIngredient,
): NormalizedIngredient => {
  let newAmount = fractionToNumber(amount);
  const isFraction = !Number.isNaN(newAmount);
  if (!isFraction) {
    newAmount = parseFloat(amount);
  }
  return {
    ...ing,
    amount: { value: newAmount, display: amount },
    isFraction,
  };
};

export const updateIngredientUnitField = (
  unit: MeasurementUnitType,
  ing: NormalizedIngredient,
): NormalizedIngredient => ({
  ...ing,
  unit: { value: unit, display: unit },
});
