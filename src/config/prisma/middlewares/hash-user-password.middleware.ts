import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export function hashUserPassword(): Prisma.Middleware {
  return async (params, next) => {
    if (params.action == 'update' && params.model == 'User') {
      const user = params.args.data;

      if (user.password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
      }

      params.args.data = user;
    }
    return next(params);
  };
}
