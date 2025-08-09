import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { throwIfNotFound } from 'src/common';
import { UserPatchDto } from './contracts';
import { UserEntity } from './contracts/users.entities';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':handle')
  @ApiOkResponse({
    description: "user's info",
    type: UserEntity,
  })
  @ApiParam({ name: 'handle', type: String, description: 'handle of user' })
  async user(@Param('handle') handle: string): Promise<UserEntity> {
    try {
      return await this.usersService.getUser(handle);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Patch(':handle')
  @ApiOkResponse({
    description: "user's info",
    type: UserEntity,
  })
  @ApiParam({ name: 'handle', type: String, description: 'handle of user' })
  async updateUser(
    @Param('handle') handle: string,
    @Body() body: UserPatchDto,
  ): Promise<UserEntity> {
    return await this.usersService.updateUser(handle, body);
  }
}
