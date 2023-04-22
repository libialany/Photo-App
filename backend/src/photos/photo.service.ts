import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CreatePhotoDTO, UpdatePhotoDTO } from 'src/dto/photos.dto';
import { Repository } from 'typeorm';
import { CreatePhotoDTO, UpdatePhotoDTO } from 'src/dto/photo.dto';
import { unlink } from 'node:fs';
import { DataSource } from 'typeorm';
import { Photo } from 'src/entity/photo.entity';
import { User } from 'src/user/entities/user.entity';
@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async getPhotos() {
    const result = await this.dataSource
      .getRepository(Photo)
      .createQueryBuilder('photo')
      .getMany();
    return result;
  }
  public async getPhotoByUserId(id: string): Promise<Photo[]> {
    const photos = this.photoRepository.findBy({ idUser: id });
    if (!photos) throw new Error('Photo not found');
    return photos;
  }

  public async deletePhotoById(id: string): Promise<void> {
    if (!id) throw new Error('photo not id');
    const photo = await this.photoRepository.findOneBy({
      id: id,
    });
    if (!photo) throw new Error('photo not found');
    try {
      unlink(`${process.env.SRC_IMAGES}${photo.url}`, (err) => {
        if (err) throw err;
        console.log(`${process.env.SRC_IMAGES}${photo.url} was deleted`);
      });
      await this.photoRepository.delete(id);
    } catch (error) {
      console.log(error);
    }
  }

  public async addPhoto(
    image: string,
    photo: CreatePhotoDTO,
    userId: string,
  ): Promise<Photo> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new Error('User not found');
    const newPhoto = new Photo();
    newPhoto.title = photo.title;
    newPhoto.url = image;
    newPhoto.description = photo.description;
    newPhoto.estado = 'ACTIVO';
    newPhoto.idUser = userId;
    console.log(`created Photo${newPhoto}`);
    return this.photoRepository.save(newPhoto);
  }
  public async updatePhoto(
    img_url: string,
    _photo: UpdatePhotoDTO,
    photoId: string,
  ) {
    const photo = await this.photoRepository.findOneBy({
      id: photoId,
    });
    try {
      unlink(`${process.env.SRC_IMAGES}${photo.url}`, (err) => {
        if (err) throw err;
        console.log(
          `${process.env.SRC_IMAGES}${photo.url} was deleted ,it will update`,
        );
      });
    } catch (error) {
      console.log(error);
    }
    if (!photo) throw new Error('Photo not found');
    const newPhoto = new Photo();
    newPhoto.title = _photo.title;
    newPhoto.description = _photo.description;
    newPhoto.url = img_url;
    console.log(`updated Photo${newPhoto}`);
    return await this.photoRepository.update({ id: photoId }, newPhoto);
  }
}
