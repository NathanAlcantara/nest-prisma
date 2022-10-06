import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UUIDParam } from 'src/shared/models/shared.dto';
import {
  CreateUserInput,
  ListUserInput,
  ListUserOutput,
  UpdateUserInput,
} from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('profile')
  getProfile(@CurrentUser() user: User): User {
    delete user.roles;
    return user;
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async list(@Query() listUserInput: ListUserInput): Promise<ListUserOutput> {
    listUserInput.where = listUserInput.q
      ? { email: listUserInput.q }
      : undefined;

    const count = await this.userService.count(listUserInput.where);
    const users = await this.userService.findMany(listUserInput);

    return {
      items: users,
      total: count,
    };
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: UUIDParam,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(id, updateUserInput);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param() { id }: UUIDParam): Promise<User> {
    return this.userService.delete(id);
  }
}
