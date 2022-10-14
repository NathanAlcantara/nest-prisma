import { Controller, Get, Query } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { ListUserInput, ListUserOutput } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('list')
  @Permissions('read:user')
  list(@Query() listUserInput: ListUserInput): Observable<ListUserOutput> {
    return this.userService.findMany(listUserInput).pipe(
      map((data) => ({
        items: data.users,
        total: data.total,
      })),
    );
  }

  // @Post()
  // @Roles(Role.ADMIN)
  // async create(@Body() createUserInput: CreateUserInput): Promise<User> {
  //   const user = await this.userService.create(createUserInput);

  //   this.notifyService.welcome(user);

  //   return user;
  // }

  // @Patch(':id')
  // @Roles(Role.ADMIN)
  // update(
  //   @Param() { id }: UUIDParam,
  //   @Body() updateUserInput: UpdateUserInput,
  // ): Promise<User> {
  //   return this.userService.update({ id }, updateUserInput);
  // }

  // @Delete(':id')
  // @Roles(Role.ADMIN)
  // delete(@Param() { id }: UUIDParam): Promise<User> {
  //   return this.userService.delete(id);
  // }
}
