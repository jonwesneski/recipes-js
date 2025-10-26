import { ApiProperty } from '@nestjs/swagger';
import { CreateRecipeDto } from '@src/recipes';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { GenerateBaseDto } from './generate-base.dto';

type ExtrasType = Pick<CreateRecipeDto, 'name' | 'description'>;

export class GenerateCategoriesDto implements ExtrasType {
  @IsString()
  @ApiProperty({ type: String })
  name: string;
  @IsString()
  @ApiProperty({ type: String, nullable: true })
  description: string | null;
  @IsArray()
  @ApiProperty({ type: [GenerateBaseDto] })
  @ValidateNested({ each: true })
  @Type(() => GenerateBaseDto)
  steps: GenerateBaseDto[];
}
