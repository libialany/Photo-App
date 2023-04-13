import { config } from 'dotenv';
config();
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AbilityModule } from 'src/ability/ability.module';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AbilityModule,
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: process.env.auth_token_expires_in },
    }),
  ],
  providers: [
    AbilityFactory,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AbilityFactory, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
