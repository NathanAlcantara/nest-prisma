import { Controller, Get, Request } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
