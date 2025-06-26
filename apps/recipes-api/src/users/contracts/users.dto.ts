import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@repo/database';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OmitPrismaFieldsDto } from 'src/common/utilityTypes';

export class UserPatchDto
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
  @ApiProperty({ type: String })
  name?: string;
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  handle?: string;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, nullable: true })
  useDarkMode?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, nullable: true })
  useFractions?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, nullable: true })
  useImperial?: boolean;
}
