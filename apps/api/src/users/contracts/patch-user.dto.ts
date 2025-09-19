import { ApiProperty } from '@nestjs/swagger';
import { Prisma, UiTheme } from '@repo/database';
import { OmitPrismaFieldsDto } from '@src/common/utilityTypes';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchUserDto
  implements
    OmitPrismaFieldsDto<
      Prisma.UserCreateInput,
      | 'Followers'
      | 'Followings'
      | 'recipes'
      | 'favorites'
      | 'handle'
      | 'name'
      | 'email'
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
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  useFractions?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false })
  useImperial?: boolean;
}
