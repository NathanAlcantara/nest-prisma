import { Controller, Get, Request } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
