import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  cursorId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}
