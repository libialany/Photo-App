import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const {
      user,
      originalUrl,
      query,
      route,
      headers,
      method: action,
    } = context.switchToHttp().getRequest() as Request;
    const resource = Object.keys(query).length ? route.path : originalUrl;
    try {
      const isPermitted = (await super.canActivate(context)) as boolean;
      if (!isPermitted) throw new ForbiddenException();
    } catch (err) {
      const token = headers.authorization
        ? `${headers.authorization.substring(0, 20)}...`
        : String(headers.authorization);

      if (!headers.authorization) {
        throw err;
      }
      throw err;
    }
    return true;
  }
}
