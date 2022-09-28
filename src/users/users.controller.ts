import { Controller, Get, Request } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('role')
  @Roles(Role.Admin)
  getRole(@Request() req) {
    return req.user.role;
  }
}
