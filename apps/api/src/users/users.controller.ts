import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from '@src/auth/guards';
import { throwIfNotFound } from '@src/common';
import { parseHelper } from '@src/common/header.decorators';
import { type Request } from 'express';
import { PatchUserDto } from './contracts';
import { PatchFollowUserDto } from './contracts/follow-user.dto';
import {
  UserAccountResponse,
  UserPublicResponse,
} from './contracts/users.entities';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
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
      const token = parseHelper(req);
      return await this.usersService.getUser(id, token.sub);
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
  @UseGuards(JwtGuard)
  async userAccount(@Param('id') id: string): Promise<UserAccountResponse> {
    try {
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

  @Patch(':id/follow')
  @ApiOkResponse({
    description: "user's info",
    type: UserAccountResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  @UseGuards(JwtGuard)
  async followUser(
    @Param('id') id: string,
    @Body() body: PatchFollowUserDto,
    @Req() req: Request,
  ) {
    const token = parseHelper(req);
    return await this.usersService.followUser(id, token.sub, body.follow);
  }
}
