import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HasRoles } from './decorators/has-roles.decorator';
import { RolesGuard } from './guards/roles-auht.guard';
import { Role } from './model/roles.enum';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Cookies } from 'src/custom-decorators/cookies';
class User {
  username: string;
  rol: Role;
  isAdmin: boolean;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    return this.authService.signUp(createUserDto, res);
  }
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Body() data: AuthDto, @Res() res: Response) {
    return this.authService.signIn(data, res);
  }

  @Post('refresh')
  async refreshtoken(
    @Cookies('access_token') refreshtoken: string,
    @Res() res: Response,
  ) {
    return await this.authService.refreshToken(refreshtoken, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const idUsuario = req.headers.authorization
      ? JSON.parse(
          Buffer.from(
            `${req.headers.authorization}`.split('.')[1],
            'base64',
          ).toString(),
        ).sub
      : null;
    return await this.authService.logout(req, res);
  }
  @HasRoles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user;
    const newUser = new User();
    newUser.isAdmin = user['isAdmin'];
    newUser.rol = user['rol'];
    newUser.isAdmin = user['username'];
    const ability = this.abilityFactory.createForUser(newUser);
    const isAllow = ability.can(Action.Read, newUser);
    if (isAllow) {
      console.log('GOOD');
    }
    return req.user;
  }
}
