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
  ) { }
  // public async getPhotosById(idProfile: string) {
  //   const postWithEntityManager = await this.photoManager
  //     .createQueryBuilder(Categoria, 'categoria')
  //     .leftJoinAndSelect('categoria.photos', 'photo')
  //     .where('categoria.id = :id', { id: idPhoto })
  //     .getOne();
  //   return postWithEntityManager;
  // }
  // public async getPhotoDetalle(idPhoto: string) {
  //   const result = await this.dataSource
  //     .createQueryBuilder(Photo, 'photo')
  //     .leftJoinAndSelect('photo.departamento', 'departamento')
  //     .leftJoinAndSelect('photo.categoria', 'categoria')
  //     .where('photo.id = :id', { id: idPhoto })
  //     .getOne();
  //   return result;
  // }

  // public async getPhotosInput(titulo: string) {
  //   const result = await this.dataSource
  //     .createQueryBuilder(Photo, 'photo')
  //     .where('LOWER(photo.titulo) LIKE :titulo', {
  //       titulo: `%${titulo.toLowerCase()}%`,
  //     })
  //     .getMany();
  //   return result;
  // }
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
    // const pathFile =
    //   '/home/usrbay/Desktop/Practica02/frontend' + photo.imagen;
    // console.log(pathFile);
    // unlink(pathFile, (err) => {
    //   if (err) throw err;
    //   console.log(`${pathFile} was deleted`);
    // });
    await this.photoRepository.delete(id);
  }
  // public async getPhotoById(id: string): Promise<Photo> {
  //   const photo = this.photoRepository.findOneBy({ id });
  //   if (!photo) throw new Error('photo not found');
  //   return photo;
  // }
  // public async getProfileById(id: string): Promise<Profile> {
  //   const profile = this.profileRepository.findOneBy({ id });
  //   if (!profile) throw new Error('profile not found');
  //   return profile;
  // }
  // public async updatePhoto(id: string, photo: UpdatePhotoDTO) {
  //   const myPhoto = await this.getPhotoById(id);
  //   if (!myPhoto) throw new Error('Photo not found');
  //   //console.log(myPhoto);
  //   myPhoto.url = photo.url;
  //   return this.photoRepository.save(myPhoto);
  // }
  // public async asignPhoto(profileId: string, photo: AssignPhotoDTO) {
  //   // console.log(profileId, photo);
  //   const myProfile = await this.getProfileById(profileId);
  //   if (!myProfile) throw new Error('Profile not found');
  //   // console.log(myProfile);
  //   const myPhoto = await this.getPhotoById(photo.photoId);
  //   if (!myPhoto) throw new Error('Photo not found');
  //   // console.log(myPhoto);
  //   const newPhoto = new Photo();
  //   newPhoto.url = myPhoto.url;
  //   newPhoto.profile = myProfile;
  //   console.log(`El usuario ${myProfile.name} tiene el auto ${myPhoto.url}`);
  //   return this.photoRepository.update(photo.photoId, newPhoto);
  // }

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
    newPhoto.idUser = userId;
    console.log(`created Photo${newPhoto}`);
    return this.photoRepository.save(newPhoto);
  }
  public async updatePhoto(
    img_url: string,
    _photo: UpdatePhotoDTO,
    photoId: string,
  ) {
    const photo = await this.userRepository.findOneBy({
      id: photoId,
    });
    if (!photo) throw new Error('User not found');
    const newPhoto = new Photo();
    newPhoto.title = _photo.title;
    newPhoto.url = img_url;
    newPhoto.description = _photo.description;
    newPhoto.estado = photo.estado;
    console.log(`updated Photo${newPhoto}`);
    return this.photoRepository.update(photoId, newPhoto);
  }
}
