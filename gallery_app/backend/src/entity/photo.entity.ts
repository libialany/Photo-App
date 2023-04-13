import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  description: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
  })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.photos, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: User;
  @Column({
    name: 'id_user',
    type: 'string',
    nullable: true,
  })
  idUser: string;
  constructor(title: string, url: string, description: string) {
    this.title = title;
    this.url = url;
    this.description = description;
  }
}
