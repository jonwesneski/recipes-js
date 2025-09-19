import { ApiProperty } from '@nestjs/swagger';
import { Prisma, UiTheme } from '@repo/database';
import { OmitPrismaFieldsEntity } from '@src/common/utilityTypes';
import { NutritionalFactsEntity } from '@src/recipes';

export class UserEntity
  implements
    OmitPrismaFieldsEntity<
      Prisma.UserCreateInput,
      'Followers' | 'Followings' | 'recipes' | 'diet' | 'favorites'
    >
{
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  email: string;
  @ApiProperty({ type: String })
  handle: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ type: NutritionalFactsEntity, nullable: true })
  diet: NutritionalFactsEntity | null;
  @ApiProperty({ enum: UiTheme, enumName: 'UiTheme' })
  uiTheme: UiTheme;
  @ApiProperty()
  useFractions: boolean;
  @ApiProperty()
  useImperial: boolean;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}
