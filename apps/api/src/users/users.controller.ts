import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { throwIfNotFound } from '@src/common';
import { PatchUserDto } from './contracts';
import { UserEntity } from './contracts/users.entities';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({
    description: "user's info",
    type: UserEntity,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  async user(@Param('id') id: string): Promise<UserEntity> {
    try {
      return await this.usersService.getUser(id);
    } catch (error) {
      throwIfNotFound(error);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: "user's info",
    type: UserEntity,
  })
  @ApiParam({ name: 'id', type: String, description: 'id of user' })
  async updateUser(
    @Param('id') id: string,
    @Body() body: PatchUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.updateUser(id, body);
  }
}
