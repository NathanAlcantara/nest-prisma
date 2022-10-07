import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorators/is-public.decorator';
import { NotifyService } from './notify.service';

@Public()
@Controller('notify')
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Get()
  sendMail(): any {
    this.notifyService.welcome();
    this.notifyService.resetPassword();
  }
}
