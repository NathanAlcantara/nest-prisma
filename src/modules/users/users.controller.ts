import { Controller, Get, Request } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('role')
  @Roles(Role.ADMIN)
  getRole(@Request() req) {
    return req.user.role;
  }
}
