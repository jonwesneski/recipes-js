import { ApiProperty } from '@nestjs/swagger';
import {
  DietaryType,
  MeasurementFormat,
  NumberFormat,
  Prisma,
  UiTheme,
} from '@repo/database';
import { OmitPrismaFieldsDto } from '@src/common/utilityTypes';
import { NutritionalFactsDto } from '@src/recipes';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PatchUserCustomDailyNutritionDto extends NutritionalFactsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  id: string;
}

export class PatchUserDto
  implements
    OmitPrismaFieldsDto<
      Partial<Prisma.UserCreateInput>,
      | 'Followers'
      | 'Followings'
      | 'recipes'
      | 'favorites'
      | 'customDailyNutrition'
    >
{
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  name?: string;
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  handle?: string;
  @IsOptional()
  @IsEnum(UiTheme)
  @ApiProperty({ enum: UiTheme, enumName: 'UiTheme', required: false })
  uiTheme?: UiTheme;
  @IsOptional()
  @IsEnum(NumberFormat)
  @ApiProperty({
    enum: NumberFormat,
    enumName: 'NumberFormat',
    required: false,
  })
  numberFormat?: NumberFormat;
  @IsOptional()
  @IsEnum(MeasurementFormat)
  @ApiProperty({
    enum: MeasurementFormat,
    enumName: 'MeasurementFormat',
    required: false,
  })
  measurementFormat?: MeasurementFormat;
  @IsOptional()
  @IsEnum(DietaryType)
  @ApiProperty({
    enum: DietaryType,
    enumName: 'DietaryType',
    required: false,
    isArray: true,
  })
  preferedDiets?: DietaryType[];
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  predefinedDailyNutritionId?: string;
  @ValidateNested()
  @Type(() => PatchUserCustomDailyNutritionDto)
  @ApiProperty({
    type: PatchUserCustomDailyNutritionDto,
    required: false,
    nullable: true,
  })
  customDailyNutrition?: PatchUserCustomDailyNutritionDto | null;
}
