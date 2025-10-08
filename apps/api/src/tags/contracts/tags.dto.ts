import { BaseQueryDto } from '@src/common';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class TagsQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  includes?: string;
}
