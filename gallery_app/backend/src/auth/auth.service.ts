import { config } from 'dotenv';
config();
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UsersService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Response, Request } from 'express';
import { Role } from './model/roles.enum';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto, res: Response): Promise<any> {
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
      newUser.rol,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return res
      .cookie('access_token', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .status(200)
      .json({
        accessToken: tokens.accessToken,
        username: newUser.username,
        rol: newUser.rol,
      });
  }

  async signIn(data: AuthDto, res: Response) {
    // Check if user exists
    const { username, password } = data;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: 'Username and password are required.' });
    const foundUser = await this.usersService.findByUsername(username);
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const passwordMatches = await argon2.verify(foundUser.password, password);
    if (passwordMatches) {
      // create JWTs
      const tokens = await this.getTokens(
        foundUser.id,
        username,
        foundUser.rol,
      );
      // Saving refreshToken with current user
      await this.updateRefreshToken(foundUser.id, tokens.refreshToken);
      // console.log(
      //   '>>>>estoy es lo que me estoy guardando',
      //   tokens.refreshToken,
      // );
      res.cookie('access_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: true,
        secure: false, //remenber
        maxAge: 60 * 24 * 60 * 60 * 1000,
        // maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({
        accessToken: tokens.accessToken,
        username: foundUser.username,
        rol: foundUser.rol,
      });
    } else {
      res.sendStatus(401);
    }
  }
  async refreshToken(refreshToken: string, res: Response) {
    //console.log('>>>>estoy es lo que me estoy recuperando de mi token server', req.cookies,res );
    if (!refreshToken) return res.sendStatus(401);
    const user = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.refresh_token,
    });
    // FIRMADO VALIDO
    if (!user) res.sendStatus(403);
    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(403);
    //create JWTs
    console.log('este es el usuario', user);
    
    const tokens = await this.getTokens(
      foundUser.id,
      foundUser.username,
      foundUser.rol,
    );
    // Saving refreshToken with current user
    await this.updateRefreshToken(foundUser.id, tokens.refreshToken);
 console.log('Ya estan ....', tokens.accessToken);
 
    res.cookie('access_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: false, //remenber
      maxAge: 60 * 24 * 60 * 60 * 1000,
      // maxAge: 24 * 60 * 60 * 1000,
    });
    console.log('paso.......');
    res.status(200).json({
      accessToken: tokens.accessToken,
      username: foundUser.username,
      rol: foundUser.rol,
      msg: 'excelante'
    });
  }
  async logout(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies || !cookies['access_token']) return res.sendStatus(401);
    const refreshToken = cookies['access_token'];
    const foundUser = await this.usersService.findByRefreshToken(refreshToken);
    if (!foundUser) {
      res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: false,
        secure: false, //remenber
      });
      res.status(204).json({ msg: 'logout' });
    }
    // Saving refreshToken with current user
    await this.updateRefreshToken(foundUser.id, '');
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: false,
      secure: false, //remenber
    });
    res.status(204).json({ msg: 'logout' });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.updateToken(userId, refreshToken);
  }

  async getTokens(userId: string, username: string, rol: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          rol: rol,
        },
        {
          secret: process.env.secret,
          expiresIn: process.env.auth_token_expires_in,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          rol: rol,
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
