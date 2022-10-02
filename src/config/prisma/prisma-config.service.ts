import { Injectable } from '@nestjs/common';
import {
  loggingMiddleware,
  PrismaOptionsFactory,
  PrismaServiceOptions,
} from 'nestjs-prisma';
import { hashUserPassword } from './middlewares/hash-user-password.middleware';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      middlewares: [loggingMiddleware(), hashUserPassword()],
    };
  }
}
