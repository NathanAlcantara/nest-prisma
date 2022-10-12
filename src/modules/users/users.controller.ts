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
import { Public } from 'src/auth/decorators/is-public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UUIDParam } from 'src/shared/models/shared.dto';
import { NotifyService } from 'src/shared/notify/notify.service';
import { TokenService } from 'src/shared/notify/token/token.service';
import {
  ChangePasswordInput,
  CreateUserInput,
  ListUserInput,
  ListUserOutput,
  UpdateUserInput,
} from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private notifyService: NotifyService,
    private tokenService: TokenService,
  ) {}

  @Post('change-password')
  @Public()
  async changePassword(
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<User> {
    const { token, password } = changePasswordInput;

    const email = await this.tokenService.getEmail(token);

    return this.userService.update({ email }, { password });
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User): User {
    delete user.roles;
    return user;
  }

  @Get('list')
  @Roles(Role.ADMIN)
  async list(@Query() listUserInput: ListUserInput): Promise<ListUserOutput> {
    listUserInput.where = listUserInput.q
      ? { email: listUserInput.q, OR: { name: listUserInput.q } }
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
  async create(@Body() createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userService.create(createUserInput);

    this.notifyService.welcome(user);

    return user;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: UUIDParam,
    @Body() updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update({ id }, updateUserInput);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param() { id }: UUIDParam): Promise<User> {
    return this.userService.delete(id);
  }
}
