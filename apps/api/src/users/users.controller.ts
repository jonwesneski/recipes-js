import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import type { JwtGoogleType, PartialJwtGoogleType } from '@repo/zod-schemas';
import { JwtGuard } from '@src/auth/guards';
import { BaseQueryDto, throwIfNotFound } from '@src/common';
import { JwtDecoded } from '@src/common/header.decorators';
import { PatchUserDto } from './contracts';
import { PutFollowUserDto } from './contracts/follow-user.dto';
import {
  UserAccountResponse,
  UserFollowingsPaginationResponse,
  UserPublicResponse,
} from './contracts/users.response';
import { PatchDtoValidationPipe } from './users.custom.pipes';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get('account')
  @ApiOkResponse({
    description: "user's account info",
    type: UserAccountResponse,
  })
  @UseGuards(JwtGuard)
  async userAccount(
    @JwtDecoded() jwtDecoded: JwtGoogleType,
  ): Promise<UserAccountResponse> {
    try {
      return await this.usersService.getUserAccount(jwtDecoded.sub);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: "user's public info",
    type: UserPublicResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  async user(
    @JwtDecoded(false) jwtDecoded: PartialJwtGoogleType,
    @Param('id') id: string,
  ): Promise<UserPublicResponse> {
    try {
      return await this.usersService.getUser(id, jwtDecoded.sub);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Patch('account')
  @ApiOkResponse({
    description: "user's info",
    type: UserAccountResponse,
  })
  @UseGuards(JwtGuard)
  async updateUserAccount(
    @JwtDecoded() jwtDecoded: JwtGoogleType,
    @Body(ValidationPipe, new PatchDtoValidationPipe()) body: PatchUserDto,
  ): Promise<UserAccountResponse> {
    return await this.usersService.updateUserAccount(jwtDecoded.sub, body);
  }

  @Get(':id/followings')
  @ApiOkResponse({
    description: "user's followings",
    type: UserFollowingsPaginationResponse,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: "id of user's followings",
  })
  @UseGuards(JwtGuard)
  async followings(
    @Param('id') id: string,
    @Query() query: BaseQueryDto,
  ): Promise<UserFollowingsPaginationResponse> {
    return await this.usersService.getFollowings({ id, ...query });
  }

  @Put(':id/follow')
  @HttpCode(204)
  @ApiNoContentResponse({ description: '(un)followed a user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'id of user to (un)follow',
  })
  @UseGuards(JwtGuard)
  async followUser(
    @JwtDecoded() jwtDecoded: JwtGoogleType,
    @Param('id') id: string,
    @Body() body: PutFollowUserDto,
  ) {
    await this.usersService.followUser(id, jwtDecoded.sub, body.follow);
  }
}
