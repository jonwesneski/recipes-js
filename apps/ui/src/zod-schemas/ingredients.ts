import { z } from 'zod/v4';

import {
  type CreateIngredientDto,
  type IngredientEntityUnit,
} from '@repo/codegen/model';
import { measurementUnits } from '@src/utils/measurements';

// 1/222 or 1 1/222
const fractionRegex =
  /([1-9]\/[1-9]{1}\d{0,2}|\d+(\s{1}[1-9]\/[1-9]{1}\d{0,2}){1})/;

const upToFiveWordsRegex = /^\s*[a-zA-Z]+(?: [a-zA-Z]+){0,4}\s*$/;

export const ingredientRowArraySchema = z
  .array(z.string())
  .check((context) => {
    let amount = '';
    let unitIndex = 1;
    // 1 or 1.5
    const possibleNumber = parseInt(context.value[0]);
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
        code: 'invalid_value',
        values: [possibleFraction, possibleNumber],
        message: `amount should be whole, decimal, or fraction`,
        expected: 'number',
        input: [possibleFraction, possibleNumber].join(' '),
      });
    } else {
      amount = possibleNumber.toString();
    }

    const unit = context.value[unitIndex];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be undefined
    if (unit === undefined) {
      return;
    }
    if (!measurementUnits.includes(unit)) {
      context.issues.push({
        code: 'invalid_type',
        message: `unit should be a valid measurement; not: '${unit}'`,
        expected: 'string',
        input: unit,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be undefined
    if (context.value[unitIndex + 1] === undefined) {
      return;
    }
    const ingredient = context.value.slice(unitIndex + 1).join(' ');
    if (!upToFiveWordsRegex.test(ingredient)) {
      context.issues.push({
        code: 'invalid_type',
        message: `ingredient should be words only; not: '${ingredient}'`,
        expected: 'string',
        input: ingredient,
      });
    }

    if (context.issues.length === 0) {
      context.value = [amount, unit, ingredient];
    }
  })
  .transform((arg, ctx) => {
    if (ctx.issues.length === 0) {
      const ingredient: CreateIngredientDto = {
        amount: Number(arg[0]),
        unit: arg[1] as IngredientEntityUnit,
        name: arg[2],
      };
      return ingredient;
    }
    return {} as CreateIngredientDto;
  });

export const ingredientsListSchema = z.array(ingredientRowArraySchema);
