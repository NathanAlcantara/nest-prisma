import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export function hashUserPassword(): Prisma.Middleware {
  return async (params, next) => {
    if (params.action == 'create' && params.model == 'User') {
      const user = params.args.data;

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);

      user.password = hash;

      params.args.data = user;
    }
    return next(params);
  };
}
