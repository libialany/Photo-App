import { config } from 'dotenv';
config();
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { Role } from './model/roles.enum';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UsersService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto, res: Response): Promise<any> {
    //// Check if user exists

    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    // Hash password
    const hash = await this.hashData(createUserDto.password);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: tokens.accessToken });
  }

  async signIn(data: AuthDto, res: Response) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: tokens.accessToken });
  }
  async refreshToken(data: AuthDto, res: Response) {
    // FIX
    console.log(data);
    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: tokens.accessToken });
  }
  async logout(userId: string) {
    const newUser = new UpdateUserDto();
    newUser.refreshToken = '';
    //return res.clearCookie('access_token');
    return this.usersService.update(userId, newUser);
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const newUser = new UpdateUserDto();
    const hashedRefreshToken = await this.hashData(refreshToken);
    newUser.refreshToken = hashedRefreshToken;
    await this.usersService.update(userId, newUser);
  }

  async getTokens(userId: string, username: string, roles: Role[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: roles,
        },
        {
          secret: process.env.secret,
          expiresIn: process.env.token_expiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: roles,
        },
        {
          secret: process.env.refresh_token,
          expiresIn: process.env.refresh_token_expiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
