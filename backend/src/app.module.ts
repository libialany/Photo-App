import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from './configDb';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PhotoModule } from './photos/photo.module';

@Module({
  imports: [dbConfig, PhotoModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
