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
class User {
  username: string;
  roles: Role[];
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

  @Post('refreshtoken')
  refreshtoken(@Req() req: Request, @Res() res: Response) {
    console.log(req.cookies['access_token']);
    //return this.authService.refreshToken(data, res);
    return res.status(200).json({ finalizado: true, mensaje: 'ok' });
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('access_token');
    const idUsuario = req.headers.authorization
      ? JSON.parse(
          Buffer.from(
            `${req.headers.authorization}`.split('.')[1],
            'base64',
          ).toString(),
        ).sub
      : null;
    this.authService.logout(idUsuario);
    return res.status(200).json({
      url: `salir sesion`,
    });
  }
  @HasRoles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = req.user;
    const newUser = new User();
    newUser.isAdmin = user['isAdmin'];
    newUser.roles = user['roles'];
    newUser.isAdmin = user['username'];
    const ability = this.abilityFactory.createForUser(newUser);
    const isAllow = ability.can(Action.Read, newUser);
    if (isAllow) {
      console.log('GOOD');
    }
    return req.user;
  }
}
