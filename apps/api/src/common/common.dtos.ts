import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  cursorId?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip?: number;
}

export enum OperatorEnum {
  And = 'AND',
  Not = 'NOT',
  Or = 'OR',
}
export function createExpressionDto<T extends Record<string, any>>(
  enumType: T,
  enumName: string,
) {
  class ExpressionDto {
    @IsEnum(OperatorEnum)
    @ApiProperty({
      enum: OperatorEnum,
      enumName: 'OperatorEnum',
    })
    operator: OperatorEnum;

    @IsEnum(enumType, { each: true })
    @IsArray()
    @ApiProperty({
      enum: enumType,
      enumName,
      required: false,
      isArray: true,
    })
    values: T[keyof T][];
  }

  return ExpressionDto;
}
