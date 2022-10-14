import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.getArgs()[0];
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
