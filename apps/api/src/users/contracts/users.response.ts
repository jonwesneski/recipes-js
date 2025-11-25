import { ApiProperty } from '@nestjs/swagger';
import {
  DietaryType,
  MeasurementFormat,
  NumberFormat,
  UiTheme,
} from '@repo/database';
import { PaginationResponse } from '@src/common/common.responses';
import { OmitPrismaFieldsEntity } from '@src/common/utilityTypes';
import { NutritionalFactsResponse } from '@src/recipes';
import { UserAccountPrismaType, type UserType } from '../users.service';

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

export class PredefinedDailyNutritionResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({
    type: NutritionalFactsResponse,
  })
  // should never be null, but doing it to make typescript happy
  nutritionalFacts: NutritionalFactsResponse | null;
}

export class CustomDailyNutritionResponse extends NutritionalFactsResponse {
  @ApiProperty({ type: String, required: false })
  id?: string;
}

export class UserAccountResponse
  implements
    OmitPrismaFieldsEntity<
      UserAccountPrismaType,
      'Followers' | 'Followings' | 'recipes' | 'favorites'
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
  @ApiProperty({ enum: UiTheme, enumName: 'UiTheme' })
  uiTheme: UiTheme;
  @ApiProperty({ enum: NumberFormat, enumName: 'NumberFormat' })
  numberFormat: NumberFormat;
  @ApiProperty({ enum: MeasurementFormat, enumName: 'MeasurementFormat' })
  measurementFormat: MeasurementFormat;
  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ enum: DietaryType, enumName: 'DietaryType', isArray: true })
  preferedDiets: DietaryType[];
  @ApiProperty({ type: PredefinedDailyNutritionResponse, nullable: true })
  predefinedDailyNutrition: PredefinedDailyNutritionResponse | null;
  @ApiProperty({ type: CustomDailyNutritionResponse, nullable: true })
  customDailyNutrition: CustomDailyNutritionResponse | null;
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
