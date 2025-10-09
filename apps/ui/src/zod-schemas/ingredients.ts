import { z } from 'zod/v4';

import {
  type CreateIngredientDto,
  type IngredientEntityUnit,
} from '@repo/codegen/model';
import { fractionToNumber, measurementUnits } from '@src/utils/measurements';

// 1/222 or 1 1/222
export const fractionRegex =
  /([1-9]\/[1-9]{1}\d{0,2}|\d+(\s{1}[1-9]\/[1-9]{1}\d{0,2}){1})/;

const upToFiveWordsRegex = /^\s*[a-zA-Z]+(?: [a-zA-Z]+){0,4}\s*$/;

export const ingredientRowArraySchema = z
  .array(z.string())
  .check((context) => {
    let amount = '';
    let unitIndex = 1;
    // 1 or 1.5
    const possibleNumber = parseInt(context.value[0]);
    // 1/2 or 1 1/2
    const possibleFraction = `${context.value[0]} ${context.value[1]}`;
    const isFraction = fractionRegex.test(possibleFraction);
    if (isFraction) {
      unitIndex = 2;
      amount = possibleFraction;
    } else if (
      Number.isNaN(possibleNumber) ||
      possibleNumber < 0 ||
      possibleNumber > 10000
    ) {
      context.issues.push({
        code: 'custom',
        message: `amount should be whole, decimal, or fraction`,
        input: possibleFraction,
        path: ['amount'],
      });
    } else {
      amount = possibleNumber.toString();
    }

    let unit = context.value[unitIndex];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be undefined
    if (unit !== undefined && !measurementUnits.includes(unit)) {
      // unit is optional, so making it empty and
      // decrementing index so ingredient can take it
      unit = '';
      unitIndex--;
    }

    const ingredientIndex = unitIndex + 1;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be undefined
    if (context.value[ingredientIndex] === undefined) {
      return;
    }
    const ingredient = context.value.slice(ingredientIndex).join(' ');
    if (!upToFiveWordsRegex.test(ingredient)) {
      context.issues.push({
        code: 'custom',
        message: `ingredient should be words only; not: '${ingredient}'`,
        input: 'ingredient',
        path: ['ingredient'],
      });
    }

    if (context.issues.length === 0) {
      context.value = [amount, unit, ingredient];
    }
  })
  .transform((arg) => {
    let amount = Number(arg[0]);
    if (isNaN(amount)) {
      amount = fractionToNumber(arg[0]);
    }
    const ingredient: CreateIngredientDto = {
      amount,
      unit: arg[1] ? (arg[1] as IngredientEntityUnit) : null,
      name: arg[2],
    };
    return ingredient;
  });

export const ingredientsListSchema = z.array(ingredientRowArraySchema);
