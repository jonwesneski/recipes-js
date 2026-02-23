import { type CreateIngredientDto } from '@repo/codegen/model';
import { ingredientRowArraySchema } from '@src/zod-schemas';
import { type NormalizedIngredient } from '@src/zod-schemas/recipeNormalized';
import { z } from 'zod/v4';
import { fractionToNumber, type MeasurementUnitType } from './measurements';

/**
 * Extracts display substrings directly from the raw input, preserving
 * trailing spaces so the textarea value matches exactly what the user typed.
 *
 * Each section's display includes its trailing space (if present), so
 * concatenating all three reproduces the original input.
 */
const splitIngredientDisplay = (
  input: string,
): { amountDisplay: string; unitDisplay: string; nameDisplay: string } => {
  const words = input.split(' ');
  const amountWordCount = words.length >= 2 && words[1]?.includes('/') ? 2 : 1;

  // Walk through the raw input using word lengths to find section boundaries
  let pos = 0;
  for (let i = 0; i < amountWordCount && i < words.length; i++) {
    pos += words[i].length;
    if (i < amountWordCount - 1) pos++; // space between fraction words
  }

  // Include the trailing space after amount (if the user typed one)
  if (input[pos] === ' ') pos++;
  const amountDisplay = input.slice(0, pos);

  // Unit section
  const unitStart = pos;
  pos += (words[amountWordCount] ?? '').length;
  if (input[pos] === ' ') pos++;
  const unitDisplay = input.slice(unitStart, pos);

  // Name section: everything remaining
  const nameDisplay = input.slice(pos);

  return { amountDisplay, unitDisplay, nameDisplay };
};

export const parseIngredientString = (input: string): NormalizedIngredient => {
  const trimmed = input.trim();
  const words = trimmed.split(' ');
  const result = ingredientRowArraySchema.safeParse(words);

  const { amountDisplay, unitDisplay, nameDisplay } = splitIngredientDisplay(
    input.trimStart(),
  );

  if (result.success) {
    return {
      amount: { value: result.data.amount.value, display: amountDisplay },
      isFraction: result.data.isFraction,
      unit: { value: result.data.unit.value, display: unitDisplay },
      name: { value: result.data.name.value, display: nameDisplay },
    };
  }

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
      value: nameDisplay.trim(),
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
  `${ing.amount.display}${ing.unit.display}${ing.name.display}`;

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
  let newAmount = fractionToNumber(amount.trim());
  const isFraction = !Number.isNaN(newAmount);
  if (!isFraction) {
    newAmount = parseFloat(amount.trim());
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
  unit: { value: unit, display: `${unit} ` },
});

export const updateIngredientNameField = (
  name: string,
  ing: NormalizedIngredient,
): NormalizedIngredient => ({
  ...ing,
  name: { value: name, display: name },
});
