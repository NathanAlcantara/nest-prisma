import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/decorators/is-public.decorator';
import { Roles } from './auth/decorators/roles.decorator';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Role } from './enums/role.enum';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

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
