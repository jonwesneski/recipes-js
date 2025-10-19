import { BaseQueryDto } from '@src/common';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetRecipesDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  userId?: string;
}
