import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const {
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest();
    const resource = Object.keys(query).length ? route.path : originalUrl;

    try {
      const isPermitted = (await super.canActivate(context)) as boolean;
      if (!isPermitted) throw new UnauthorizedException();
    } catch (err) {
      throw err;
    }
    return true;
  }
}
