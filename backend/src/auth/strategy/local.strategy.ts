import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super();
  }

  async validate(username: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    //console.log('local.stategy>',user)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
