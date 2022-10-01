import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma-health.service';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
