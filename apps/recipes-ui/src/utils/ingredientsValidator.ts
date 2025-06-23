import { IngredientDto } from '@repo/recipes-codegen/model';
import { ingredientsListSchema } from '@src/zod-schemas';
import { ZodError } from 'zod/v4';

export class IngredientsValidator {
  public stringValue: string;
  public error?: ZodError<IngredientDto[]>;
  public dto: IngredientDto[];
  constructor(params: { stringValue?: string; dto?: IngredientDto[] }) {
    if (typeof params.stringValue === 'string') {
      this.stringValue = params.stringValue;
      const result = ingredientsListSchema.safeParse(
        params.stringValue.split('\n').map((l) => l.split(' ')),
      );
      this.error = result.error;
      this.dto = result.data || [];
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
