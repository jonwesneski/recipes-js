import { type CreateIngredientDto } from '@repo/codegen/model';
import {
  fractionRegex,
  ingredientRowArraySchema,
  ingredientsListSchema,
} from '@src/zod-schemas';
import { NormalizedIngredient } from '@src/zod-schemas/recipeNormalized';
import { z, type ZodError } from 'zod/v4';
import { type $ZodFlattenedError } from 'zod/v4/core';
import { fractionToNumber, type MeasurementUnitType } from './measurements';

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

export const createIngredientDataHelper = (params: {
  stringValue?: string;
  dto?: CreateIngredientDto;
}): NormalizedIngredient => {
  if (typeof params.stringValue === 'string') {
    const stringValue = params.stringValue;
    const result = ingredientRowArraySchema.safeParse(
      params.stringValue.trim().split(' '),
    );
    const error = result.error ? z.flattenError(result.error) : undefined;
    const dto = result.data ?? ({} as CreateIngredientDto);
    return { dto, stringValue, error };
  } else if (params.dto) {
    const dto = params.dto;
    const stringValue = `${dto.amount} ${dto.unit} ${dto.name}`;
    return { dto, stringValue, error: undefined };
  }
  throw new Error('Please use 1 of the params');
};

export const updateIngredientAmount = (
  amount: string,
  dto?: CreateIngredientDto,
): NormalizedIngredient => {
  let newAmount = fractionToNumber(amount);
  const isFraction = !Number.isNaN(newAmount);
  if (!isFraction) {
    newAmount = parseInt(amount);
  }

  let newDto: NormalizedIngredient;
  if (dto) {
    newDto = {
      dto: {
        ...dto,
        isFraction,
        amount: newAmount,
      },
      stringValue: `${newAmount} ${dto.unit} ${dto.name}`,
      error: undefined,
    };
  } else {
    newDto = createIngredientDataHelper({ stringValue: amount });
  }

  return newDto;
};

export const updateIngredientMeasurementUnit = (
  measurementUnit: MeasurementUnitType,
  dto: CreateIngredientDto,
): NormalizedIngredient => {
  const newDto: CreateIngredientDto = {
    ...dto,
    unit: measurementUnit,
  };
  const stringValue = `${newDto.amount} ${newDto.unit} ${newDto.name}`;
  return { dto: newDto, stringValue, error: undefined };
};
