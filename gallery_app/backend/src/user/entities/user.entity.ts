import { Role } from 'src/auth/model/roles.enum';
import { Photo } from 'src/entity/photo.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  rol: Role;

  @Column({ default: '' })
  refreshToken: string;

  @OneToMany(() => Photo, (photo) => photo.user, {
    nullable: true,
  })
  photos: Photo[];

  // constructor(name: string, username: string, password: string) {
  //   this.name = name;
  //   this.username = username;
  //   this.password = password;
  // }
}
