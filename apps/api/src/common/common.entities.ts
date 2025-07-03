import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
export class BaseQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cursorId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}
