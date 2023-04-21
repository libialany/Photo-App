import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/entity/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
@Module({
  imports: [TypeOrmModule.forFeature([Photo, User])],
  controllers: [PhotoController],
  providers: [PhotoService, UsersService],
})
export class PhotoModule {}
