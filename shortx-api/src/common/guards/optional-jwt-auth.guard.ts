import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    // If there is an error or no user, do not throw 401; return undefined instead
    return user || undefined;
  }
}
