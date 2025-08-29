import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '@src/common/custom.class-validators';
import { CreateIngredientDto, CreateStepDto } from '@src/recipes';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class GenerateNutritionalFactsDto
  implements Omit<CreateStepDto, 'base64Image'>
{
  @IsString()
  @IsNullable()
  @ApiProperty({ type: String, nullable: true })
  instruction: string | null;
  @IsArray()
  @ApiProperty({ type: [CreateIngredientDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients: CreateIngredientDto[];
}
