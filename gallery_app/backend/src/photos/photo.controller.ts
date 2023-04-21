import { config } from 'dotenv';
config();
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { GetPhotoDTO, CreatePhotoDTO, UpdatePhotoDTO } from 'src/dto/photo.dto';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-auht.guard';
import { Role } from 'src/auth/model/roles.enum';
import { Request } from 'express';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/auth/dto/user-payload.dto';
import { PhotoService } from './photo.service';
import { Photo } from 'src/entity/photo.entity';

@Controller('photo')
export class PhotoController {
  constructor(
    private photoService: PhotoService,
    private usersService: UsersService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPhotoDetalle(@Param('id') id: string): Promise<Photo[]> {
    return this.photoService.getPhotoByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.env.SRC_IMAGES + process.env.DST_IMAGES);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
        },
      }),
    }),
  )
  async postPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() noticia: CreatePhotoDTO,
    @Req() req: Request,
  ) {
    if (
      !req ||
      !req.user ||
      !req.user['username'] ||
      req.user['username'] === ''
    ) {
      throw new UnauthorizedException();
    }
    // request
    const user = await this.usersService.findByUsername(req.user['username']);
    console.log(user);

    const imageUrl = process.env.DST_IMAGES + '/' + file.filename;
    console.log(imageUrl);

    return this.photoService.addPhoto(imageUrl, noticia, user.id);
  }

  // @HasRoles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard) //, RolesGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.env.SRC_IMAGES + process.env.DST_IMAGES);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
        },
      }),
    }),
  )
  async updatePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() photo: UpdatePhotoDTO,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    if (
      !req ||
      !req.user ||
      !req.user['username'] ||
      req.user['username'] === ''
    ) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findByUsername(req.user['username']);
    const imageUrl = process.env.DST_IMAGES + file.filename;
    return this.photoService.updatePhoto(imageUrl, photo, user.id);
  }
  @Get()
  async allPhotos() {
    return this.photoService.getPhotos();
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: string) {
    return this.photoService.deletePhotoById(id);
  }
}
