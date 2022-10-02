import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }
}
