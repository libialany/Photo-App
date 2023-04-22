import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Cookies } from 'src/custom-decorators/cookies';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private abilityFactory: AbilityFactory,
  ) { }

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
    @Cookies('access_token') refreshToken: string,
    @Res() res: Response,
  ) {
    return await this.authService.refreshToken(refreshToken, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(
    @Res() res: Response,
    @Cookies('access_token') refreshToken: string,
  ) {
    res.clearCookie('token');
    return await this.authService.logout(refreshToken, res);
  }
}
