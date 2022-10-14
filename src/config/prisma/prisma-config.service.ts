import { Injectable } from '@nestjs/common';
import {
  loggingMiddleware,
  PrismaOptionsFactory,
  PrismaServiceOptions,
} from 'nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      middlewares: [loggingMiddleware()],
    };
  }
}
