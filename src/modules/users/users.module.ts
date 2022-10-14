import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotifyModule } from 'src/shared/notify/notify.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [NotifyModule, HttpModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
