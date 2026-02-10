import { type CreateIngredientDto } from '@repo/codegen/model';
import {
  fractionRegex,
  ingredientRowArraySchema,
  ingredientsListSchema,
} from '@src/zod-schemas';
import { type ZodError, z } from 'zod/v4';
import { type $ZodFlattenedError } from 'zod/v4/core';

export const splitAmountAndRest = (input: string): [string, string] => {
  const parts = input.split(' ');
  if (parts.length >= 2 && fractionRegex.test(parts[1])) {
    return [parts.slice(0, 2).join(' '), parts.slice(2).join(' ')];
  }
  return [parts[0] || '', parts.slice(1).join(' ')];
};

export class IngredientsValidator {
  public stringValue: string;
  public error?: ZodError<CreateIngredientDto[]>;
  public dto: CreateIngredientDto[];
  constructor(params: { stringValue?: string; dto?: CreateIngredientDto[] }) {
    if (typeof params.stringValue === 'string') {
      this.stringValue = params.stringValue;
      const result = ingredientsListSchema.safeParse(
        params.stringValue.split('\n').map((l) => l.split(' ')),
      );
      this.error = result.error;
      this.dto = result.data ?? [];
    } else if (params.dto) {
      this.dto = params.dto;
      this.stringValue = this.dto
        .map((i) => `${i.amount} ${i.unit} ${i.name}`)
        .join('\n');
    } else {
      throw new Error('Please use 1 of the params');
    }
  }
}

export class IngredientValidator {
  public stringValue: string;
  public error?: $ZodFlattenedError<CreateIngredientDto>;
  public dto: CreateIngredientDto;
  constructor(params: { stringValue?: string; dto?: CreateIngredientDto }) {
    if (typeof params.stringValue === 'string') {
      this.stringValue = params.stringValue;
      const result = ingredientRowArraySchema.safeParse(
        params.stringValue.trim().split(' '),
      );
      this.error = result.error ? z.flattenError(result.error) : undefined;
      this.dto = result.data ?? ({} as CreateIngredientDto);
    } else if (params.dto) {
      this.dto = params.dto;
      this.stringValue = `${this.dto.amount} ${this.dto.unit} ${this.dto.name}`;
    } else {
      throw new Error('Please use 1 of the params');
    }
  }
}
