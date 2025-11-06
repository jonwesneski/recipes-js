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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { BaseQueryDto, throwIfNotFound } from '@src/common';
import { parseHelper } from '@src/common/header.decorators';
import { type Request } from 'express';
import { PatchUserDto } from './contracts';
import { PutFollowUserDto } from './contracts/follow-user.dto';
import {
  UserAccountResponse,
  UserFollowersPaginationResponse,
  UserPublicResponse,
} from './contracts/users.response';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({
    description: "user's public info",
    type: UserPublicResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  async user(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserPublicResponse> {
    try {
      let requestedUser: string | undefined;
      try {
        requestedUser = parseHelper(req).sub;
      } catch {
        // ignore
      }
      return await this.usersService.getUser(id, requestedUser);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Get(':id/account')
  @ApiOkResponse({
    description: "user's account info",
    type: UserAccountResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  //@UseGuards(JwtGuard)
  async userAccount(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserAccountResponse> {
    try {
      this.logger.log('answer');
      this.logger.log(JSON.stringify(parseHelper(req)));
      return await this.usersService.getUserAccount(id);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Patch(':id/account')
  @ApiOkResponse({
    description: "user's info",
    type: UserAccountResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  @UseGuards(JwtGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: PatchUserDto,
  ): Promise<UserAccountResponse> {
    return await this.usersService.updateUserAccount(id, body);
  }

  @Get(':id/followers')
  @ApiOkResponse({
    description: "user's followers",
    type: UserFollowersPaginationResponse,
  })
  @ApiParam({ name: 'id', type: String, description: "id of user's followers" })
  @UseGuards(JwtGuard)
  async followers(
    @Param('id') id: string,
    @Query() query: BaseQueryDto,
  ): Promise<UserFollowersPaginationResponse> {
    return await this.usersService.getFollowers({ id, ...query });
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
    @Param('id') id: string,
    @Body() body: PutFollowUserDto,
    @Req() req: Request,
  ) {
    const token = parseHelper(req);
    await this.usersService.followUser(id, token.sub, body.follow);
  }
}
