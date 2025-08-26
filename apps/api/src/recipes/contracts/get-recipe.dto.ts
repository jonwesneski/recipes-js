import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  byOwner: boolean = false;
}
