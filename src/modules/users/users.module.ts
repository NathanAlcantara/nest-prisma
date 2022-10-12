import { Module } from '@nestjs/common';
import { NotifyModule } from 'src/shared/notify/notify.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [NotifyModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
