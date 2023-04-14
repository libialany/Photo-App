import { Role } from 'src/auth/model/roles.enum';
import { Photo } from 'src/entity/photo.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
@Entity()
export class User extends BaseEntity {
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
  role: Role[];

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
  constructor(data?: Partial<User>) {
    super();
    if (data) Object.assign(this, data);
  }
  // constructor(data?: Partial<User>) {
  //   super(data);
  // }
}
