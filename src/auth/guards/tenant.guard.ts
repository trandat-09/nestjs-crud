import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User attached after authentication
    const task = request.task; // Task resolved in middleware or route handler

    if (user.tenant.id !== task.tenant.id) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
