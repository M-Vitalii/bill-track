import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces';

const getCurrentUserByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest<AuthenticatedRequest>().user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
