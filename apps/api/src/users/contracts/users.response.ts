import { ApiProperty } from '@nestjs/swagger';
import {
  MeasurementFormat,
  NumberFormat,
  Prisma,
  UiTheme,
} from '@repo/database';
import { PaginationResponse } from '@src/common/common.responses';
import { OmitPrismaFieldsEntity } from '@src/common/utilityTypes';
import { NutritionalFactsResponse } from '@src/recipes';
import { type UserType } from '../users.service';

export class UserPublicResponse implements UserType {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  handle: string;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ type: Number })
  followers: number;
  @ApiProperty({ type: Number })
  followings: number;
  @ApiProperty({ type: Number })
  recipes: number;
  @ApiProperty({ type: Boolean, required: false })
  amIFollowing?: boolean;
}

export class UserAccountResponse
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
  @ApiProperty({ type: NutritionalFactsResponse, nullable: true })
  diet: NutritionalFactsResponse | null;
  @ApiProperty({ enum: UiTheme, enumName: 'UiTheme' })
  uiTheme: UiTheme;
  @ApiProperty({ enum: NumberFormat, enumName: 'NumberFormat' })
  numberFormat: NumberFormat;
  @ApiProperty({ enum: MeasurementFormat, enumName: 'MeasurementFormat' })
  measurementFormat: MeasurementFormat;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}

export class UserFollowersResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  handle: string;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
}

export class UserFollowersPaginationResponse {
  @ApiProperty({ type: [UserFollowersResponse] })
  data: UserFollowersResponse[];
  @ApiProperty({ type: PaginationResponse })
  pagination: PaginationResponse;
}
