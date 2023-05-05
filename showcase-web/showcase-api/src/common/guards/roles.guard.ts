import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly roles: string[]) {
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const hasRole = () => this.roles.includes(user.role);

    return user && user.role && hasRole();
  }
}
