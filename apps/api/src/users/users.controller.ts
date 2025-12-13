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
  ValidationPipe,
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Req() req: Request,
  ): Promise<UserAccountResponse> {
    try {
      const token = parseHelper(req);
      return await this.usersService.getUserAccount(token.sub);
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Req() req: Request,
    @Param('id') id: string,
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

  @Patch('account')
  @ApiOkResponse({
    description: "user's info",
    type: UserAccountResponse,
  })
  @UseGuards(JwtGuard)
  async updateUserAccount(
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Req() req: Request,
    @Body(ValidationPipe, new PatchDtoValidationPipe()) body: PatchUserDto,
  ): Promise<UserAccountResponse> {
    const id = parseHelper(req).sub;
    return await this.usersService.updateUserAccount(id, body);
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
    // TODO: can't get this to work in jest
    //@JwtDecodedHeader() jwtDecodedHeader: JwtGoogleType,
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PutFollowUserDto,
  ) {
    const token = parseHelper(req);
    await this.usersService.followUser(id, token.sub, body.follow);
  }
}
