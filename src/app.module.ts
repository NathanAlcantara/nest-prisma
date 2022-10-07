import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/environment';
import { PrismaConfigService } from './config/prisma/prisma-config.service';
import { HealthModule } from './health/health.module';
import { ModulesModule } from './modules/modules.module';
import { NotifyModule } from './notify/notify.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      cache: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLE_TTL'),
        limit: configService.get('THROTTLE_LIMIT'),
      }),
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
    HealthModule,
    AuthModule,
    NotifyModule,
    SharedModule,
    ModulesModule,
  ],
})
export class AppModule {}
