import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().default(
          'postgresql://postgres:postgres@localhost:5432/postgres',
        ),
        JWT_SECRET: Joi.string().default('s3cr3t'),
        THROTTLE_TTL: Joi.number().default(60),
        THROTTLE_LIMIT: Joi.number().default(10),
      }),
      cache: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    AuthModule,
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
