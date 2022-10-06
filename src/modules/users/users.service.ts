import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ListUserInput } from './user.dto';

@Injectable()
export class UsersService {
  selectWithoutPassword = {
    id: true,
    email: true,
    password: false,
    roles: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(private prisma: PrismaService) {}

  findUnique(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  findMany(listUserInput: ListUserInput): Promise<User[]> {
    const skip = (listUserInput.page - 1) * listUserInput.pageSize;
    const take = listUserInput.pageSize;

    const orderBy = listUserInput.orderBy
      ? {
          [listUserInput.orderBy]: listUserInput.sortOrder,
        }
      : undefined;

    return this.prisma.user.findMany({
      skip: Number(skip) || undefined,
      take: Number(take) || undefined,
      where: listUserInput.where,
      orderBy: orderBy,
      select: this.selectWithoutPassword,
    });
  }

  count(userWhereInput: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({
      where: userWhereInput,
    });
  }

  create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userCreateInput,
      select: this.selectWithoutPassword,
    });
  }

  update(id: string, userUpdateInput: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userUpdateInput,
      select: this.selectWithoutPassword,
    });
  }

  delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
      select: this.selectWithoutPassword,
    });
  }
}
