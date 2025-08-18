import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@repo/database';
import { OmitPrismaFieldsDto } from '@src/common/utilityTypes';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchUserDto
  implements
    OmitPrismaFieldsDto<
      Prisma.UserCreateInput,
      | 'Followers'
      | 'Followings'
      | 'recipes'
      | 'diet'
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
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, nullable: true })
  useDarkMode?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, nullable: true })
  useFractions?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: false, nullable: true })
  useImperial?: boolean;
}
