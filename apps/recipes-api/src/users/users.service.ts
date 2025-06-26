import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import { PrismaService } from 'src/common/prisma.service';
import { UserPatchDto } from './contracts';

type UserPrismaType = Prisma.UserGetPayload<{
  include: {
    diet: true;
  };
  omit: {
    id: true;
  };
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(handle: string): Promise<UserPrismaType> {
    return await this.prisma.user.findFirstOrThrow({
      where: { handle },
      include: { diet: true },
    });
  }

  async updateUser(
    handle: string,
    user: UserPatchDto,
  ): Promise<UserPrismaType> {
    console.log(await this.prisma.user.findMany());

    return await this.prisma.user.update({
      where: { handle },
      data: user,
      include: { diet: true },
    });
  }
}
