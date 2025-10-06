import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
export class BaseQueryDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
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
