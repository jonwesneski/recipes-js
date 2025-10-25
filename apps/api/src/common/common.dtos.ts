import { IsInt, IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  cursorId?: string;

  @IsOptional()
  @IsInt()
  take?: number;

  @IsOptional()
  @IsInt()
  skip?: number;
}
